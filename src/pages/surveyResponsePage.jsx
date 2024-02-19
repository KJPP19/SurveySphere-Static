import { useState, useEffect } from "react";
import { fetchSurveyByShareId, submitResponse } from "../services/api/apiSurveyResponse";
import { useParams } from "react-router-dom";

function SurveyResponse () {
    const { shareId } = useParams();
    const [ questionList, setQuestionList ] = useState([]);
    const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState(0);
    const [ isShareIdNotFound, setIsShareIdNotFound ] = useState(false);
    const [ isSurveyLoading, setIsSurveyLoading ] = useState(false);
    const [ isSurveyEnabled, setIsSurveyEnabled ] = useState(false);
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ responseData, setResponseData ] = useState({
        survey: "",
        responses: [],
    });

    useEffect(() => {
        const fetchSurveyDetail = async () => {
            try {
                setIsSurveyLoading(true);
                const response = await fetchSurveyByShareId(shareId);
                setQuestionList(response.data.data.questions);
                setIsSurveyEnabled(response.data.data.isEnabled);
                setResponseData(prevState => ({
                    ...prevState,
                    survey: response.data.data._id
                }));
            } catch (error) {
                if(error.response.data.status === 404 && error.response.data.error === "survey not found"){
                    setIsShareIdNotFound(true);
                }
            } finally {
                setIsSurveyLoading(false);
            }
        }

        fetchSurveyDetail();
    }, [shareId])

    const generateRange = () => {
        const minValue = Math.min(...questionList[currentQuestionIndex].labels);
        const maxValue = Math.max(...questionList[currentQuestionIndex].labels);

        const range = [];
        for(let i = minValue; i <= maxValue; i++) {
            range.push(i);
        }
        return range;
        
    }

    const handleAnswerChange = (e) => {
        const { value } = e.target;
        const question = questionList[currentQuestionIndex]._id;

        setResponseData(prevState => {
            const updatedResponses = [...prevState.responses];
            updatedResponses[currentQuestionIndex] = { question, answer: value };
            return {...prevState, responses: updatedResponses};
        });
    };

    const handleSubmitResponse = async() => {
        try {
            setIsSubmitting(true);
            await submitResponse(responseData);
            setIsSubmitted(true);
        } catch (error) {
            console.error("failed to submit response", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextPage = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    };

    const handlePrevPage = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    };

    return (
        <div className="font-raleway">
            {isSubmitted && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
                <div className="font-semibold text-lg">Thank you for your valuable feedback! Your response has been successfully submitted</div>
                </div>
            )}
            {isSurveyLoading ? (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
                    <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-black"></div>
                </div>
            ) : (
                isShareIdNotFound || !isSurveyEnabled ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-50">
                        <div className="bg-white p-10 rounded-md shadow-md text-center space-y-10">
                            <div className="font-semibold text-5xl">SurveySphere</div>
                            <div className="text-lg text-gray-800">Survey not found, Survey must have been disabled or invalid address</div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 md:p-8 lg:p-16 h-screen flex justify-center items-center">
                        <div className="h-full w-8/12 bg-white flex flex-col justify-between shadow-lg rounded-md p-10">
                            {questionList.length > 0 && (
                                <>
                                    <div className="space-y-16">
                                        <div>
                                            <div className="flex flex-row items-center justify-between">
                                                <div  className="text-lg">{currentQuestionIndex+1}</div>
                                                <div>
                                                    {currentQuestionIndex === questionList.length - 1 && (
                                                        <button onClick={handleSubmitResponse} disabled={isSubmitting} className="py-2 px-3 bg-black text-white font-semibold text-sm rounded-md hover:opacity-70 disabled:opacity-20">{isSubmitting ? 'submitting...' : 'submit response'}</button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-justify text-lg font-semibold tracking-wider py-1">{questionList[currentQuestionIndex].title}</div>
                                            {questionList[currentQuestionIndex].isRequired && (
                                                <div className="rounded-md text-sm bg-gray-100 py-2 px-3 text-gray-600 w-fit">Required Field</div>
                                            )}
                                        </div>
                                        <div>
                                        {questionList[currentQuestionIndex].questiontype === 'form' && (
                                            <input onChange={handleAnswerChange} value={responseData.responses[currentQuestionIndex]?.answer || ''} className="border-b p-1 w-4/5 text-lg border-b-gray-200 hover:border-b-black focus:outline-none" type="text" placeholder="Your Answer Here."/> 
                                        )}
                                        {questionList[currentQuestionIndex].questiontype === 'essay' && (
                                            <textarea onChange={handleAnswerChange} value={responseData.responses[currentQuestionIndex]?.answer || ''} rows="6" className="border border-gray-200 rounded-md p-2 w-4/5 hover:border-black focus:outline-none resize-none" placeholder="Your Answer Here."/>
                                        )}
                                        {questionList[currentQuestionIndex].questiontype === 'choice' && (
                                            <div className="space-y-2">
                                               { questionList[currentQuestionIndex].labels.map((choice, index) => (
                                                    <div className="flex flex-row items-center" key={index}>
                                                        <input className="hidden" type="radio" id={`choice-${index}`} value={choice} onChange={handleAnswerChange} checked={responseData.responses[currentQuestionIndex]?.answer === choice}/>
                                                        <label className={`text-lg py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50 ${responseData.responses[currentQuestionIndex]?.answer === choice ? 'bg-black text-white font-semibold': ''}`} htmlFor={`choice-${index}`}>{choice}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {questionList[currentQuestionIndex].questiontype === 'scale' && (
                                            <div className="flex flex-row items-center">
                                                {generateRange().map((value, index) => (
                                                    <div className="flex-grow space-x-1" key={index}>
                                                        <input className="hidden" type="radio" id={`scale-${index}`} value={value} checked={responseData.responses[currentQuestionIndex]?.answer == value} onChange={handleAnswerChange}/>
                                                        <label className={`flex justify-center cursor-pointer border p-3 border-black hover:bg-gray-50 ${responseData.responses[currentQuestionIndex]?.answer == value ? 'bg-black text-white font-semibold' : ''}`} htmlFor={`scale-${index}`}>{value}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end">
                                <button className="disabled:text-gray-300" onClick={handlePrevPage} disabled={currentQuestionIndex === 0}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <button className="disabled:text-gray-300" onClick={handleNextPage} disabled={currentQuestionIndex === questionList.length - 1 || (questionList[currentQuestionIndex].isRequired && !responseData.responses[currentQuestionIndex]?.answer)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>   
                            
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export default SurveyResponse;