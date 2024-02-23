import NavBar from "../components/navbar/navbar";
import Popup from "../components/popup/popup";
import useAuth from "../hooks/useAuth";
import useToggle from "../hooks/useToggle";
import updateArrayItemsById from "../utils/helpers/updateArrayState";
import { useParams, useLocation } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { fetchSurveyDetail, enableSurvey } from "../services/api/apiSurvey";
import { createNewQuestion, updateQuestion, toggleQuestionRequired, updateQuestionType, deleteQuestion } from "../services/api/apiQuestion"; 
import  ChoiceInput  from "../components/surveyFormInputs/editableChoiceField";
import ScaleInput from "../components/surveyFormInputs/editableScaleField";
import EditableField from "../components/button/editableField";

function Survey () {
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();
    const { surveyId } = useParams();
    const location = useLocation();
    const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
    const [ isSurveyEnabled, setIsSurveyEnabled ] = useState(false);
    const [ isQuestionRequired, setIsQuestionRequired ] = useState(false);
    const [ questionList, setQuestionList ] = useState([]);
    const [questionTitle, setQuestionTitle] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const questionTypesPopup = useToggle(false);
    const isEditingQuestionTitle = useToggle(false);
    const isQuestionTypeDropdwon = useToggle(false);

    const options = [
        {id:'workspace', name:'Workspace', link: '/workspace'},
        {id:'create', name:'Create', link: `/surveys/${surveyId}/create`},
        {id:'share', name:'Share', link: `/surveys/${surveyId}/share`},
        {id:'results', name:'Results', link: `/surveys/${surveyId}/results`},
    ];

    const questionTypes = [
        {name: "form", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
        </svg>
        },
        {name: "essay", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
        },
        {name: "choice", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        },
        {name: "scale", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
      }
    ]

    const handleSessionExpiration = (error) => {
        if(error.response.data.status === 401 && error.response.data.error === "your session has expired, please login again"){
          deauthenticateUser(error.response.data.error);
        }
        return error;
    };

    const handleQuestionRequiredChange = async(questionId) => {
        const newValue = !isQuestionRequired;
        console.log(newValue);
        try {
            const response = await toggleQuestionRequired(questionId, newValue);
            setIsQuestionRequired(response.data.data.isRequired);
        } catch (error) {
            handleSessionExpiration(error);
        }
    };

    const handleEnableSurvey = async () => {
        const newValue = !isSurveyEnabled;
        try {
            const response = await enableSurvey(surveyId, newValue);
            setIsSurveyEnabled(response.data.data.isEnabled);
        } catch (error) {
            handleSessionExpiration(error);
        }
    };

    const handleAddQuestion = async (type) => {
        try {
            const questiondata = {questiontype: type, surveyId: surveyId};
            const response = await createNewQuestion(questiondata);
            setQuestionList(prevQuestions => [...prevQuestions, response.data.data]);
            questionTypesPopup.toggle();
        } catch (error) {
            handleSessionExpiration(error);
        }
    };

    const handleQuestionClick = async (questionId) => {
        const clickedQuestion = questionList.find(question => question._id === questionId);
        setSelectedQuestion(clickedQuestion);
        setIsQuestionRequired(clickedQuestion.isRequired);
    };

    const handleUpdateQuestionTitle = async (questionId) => {
        if (questionTitle.trim() !== '') {
            try {
                const response = await updateQuestion(questionId, questionTitle);
                setQuestionList(prevQuestions => updateArrayItemsById(prevQuestions, response.data.data._id, response.data.data));
                setSelectedQuestion(response.data.data);
            } catch (error) {
                handleSessionExpiration(error);
            } finally {
                setQuestionTitle('');
            }
        }
        isEditingQuestionTitle.toggle();
    };

    const handleUpdateQuestionType = async (questionId, type) => {
        try {
            const response = await updateQuestionType(questionId, type);
            setQuestionList(prevQuestions => updateArrayItemsById(prevQuestions, response.data.data._id, response.data.data));
            setSelectedQuestion(response.data.data);
            isQuestionTypeDropdwon.toggle();
        } catch (error) {
            handleSessionExpiration(error);
        }
    };

    const handleDeleteQuestion = async(questionId) => {
        try {
            await deleteQuestion(questionId);
            setQuestionList((prevQuestions) => {return prevQuestions.filter((question) => question._id !== questionId);});
            setSelectedQuestion('');
        } catch (error) {
            handleSessionExpiration(error);
        }
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsQuestionsLoading(true);
                const response = await fetchSurveyDetail(surveyId);
                setQuestionList(response.data.data.questions);
                setIsSurveyEnabled(response.data.data.isEnabled);
                if (response.data.data.questions.length > 0) {
                    setSelectedQuestion(response.data.data.questions[0]);
                } else {
                    setSelectedQuestion(null);
                }
            } catch (error) {
                handleSessionExpiration(error);
            } finally {
                setIsQuestionsLoading(false);
            }
        };

        fetchQuestions();
    }, [surveyId])

    return (
        <div className="h-screen w-screen overflow-hidden">
            <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()} menuItems={options} currentPath={location.pathname}/>
            <div className="flex flex-row h-full font-raleway">
                <div className="p-4 border-r space-y-10 w-1/5 flex-none">
                    <div className="flex flex-row justify-between items-center">
                        <div className="font-semibold text-sm">Questions</div>
                        <button onClick={questionTypesPopup.toggle} className="border p-1 rounded-sm text-[#848484] bg-gray-100 hover:border-black hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                    <div className="overflow-y-auto h-5/6">
                        {isQuestionsLoading ? (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
                                <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-black"></div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                {questionList.length === 0 ? (
                                    <div className="flex justify-center text-md text-gray-400">No content</div>
                                ) : (
                                    questionList.map((question, index) => (
                                        <button className={`flex flex-row items-center space-x-2 p-1 w-full ${selectedQuestion && selectedQuestion._id === question._id ? 'bg-gray-200' : 'hover:bg-gray-50'}`} key={question._id} onClick={() => handleQuestionClick(question._id)}>
                                            <div className="text-sm">{index+1}</div>
                                            <div className="bg-black text-white p-1">{questionTypes.find((type) => type.name === question.questiontype)?.icon || 'icon not found'}</div>
                                            <div className="overflow-hidden">
                                                {question.title ? (
                                                    <div className="text-xs truncate">{question.title}</div>
                                                ) : (
                                                    <div className="font-semibold tracking-widest">...</div>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grow p-24 bg-gray-50">
                    {questionList.length === 0 && (
                        <div className="bg-white h-full w-full">
                            <div className="flex flex-col justify-center items-center h-full">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </div>
                                <div className="text-gray-400 text-lg">It looks like your survey has no questions</div>
                                <button onClick={questionTypesPopup.toggle} className="mt-4 p-2 border bg-black text-white font-semibold tracking-wider rounded-md text-sm hover:opacity-55">Add your first Question</button>
                            </div>
                        </div>
                    )}
                    
                    {selectedQuestion && (
                        <div className="relative shadow-md bg-white h-full w-full">
                            <button onClick={() => handleDeleteQuestion(selectedQuestion._id)} className="absolute text-red-500 bg-red-200 -top-3 -right-3 p-1 rounded-full hover:bg-red-300 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="p-16 space-y-16 h-full w-full overflow-y-auto">
                                <div>    
                                    <EditableField 
                                    isEditing={isEditingQuestionTitle} 
                                    value={questionTitle} 
                                    inputChange={(e) => setQuestionTitle(e.target.value)} 
                                    onFinishEditing={() => handleUpdateQuestionTitle(selectedQuestion._id)} 
                                    handleButtonClick={() => {selectedQuestion.title && setQuestionTitle(selectedQuestion.title); isEditingQuestionTitle.toggle()}} buttonText={selectedQuestion.title} placeholder="Put your question here"/>
                                </div>
                                <div>
                                    {selectedQuestion.questiontype === 'form' && (
                                        <input disabled className="border-b p-1 w-4/5 bg-white focus:outline-none" type="text" placeholder="Your Answer Here."/> 
                                    )}
                                    {selectedQuestion.questiontype === 'essay' && (
                                        <textarea disabled rows="6" className="border bg-white border-gray-200 p-2 rounded-md w-4/5 text-md resize-none" placeholder="Your Answer Here."/>
                                    )}
                                    {selectedQuestion.questiontype === 'choice' && <ChoiceInput question={selectedQuestion}/>}
                                    {selectedQuestion.questiontype === 'scale' && <ScaleInput question={selectedQuestion}/>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-l border-r w-1/5 flex-none space-y-16">
                    <div className={`cursor-pointer text-xs p-3 tracking-wider flex border rounded-md ${isSurveyEnabled ? 'bg-green-100 text-green-500 transition-colors duration-300 hover:text-red-700 hover:bg-red-200' : 'bg-gray-100 text-gray-400 transition-colors duration-300 hover:text-black hover:border-black'}  font-semibold justify-center`} onClick={handleEnableSurvey}>
                        {isSurveyEnabled ? 'Enabled' : 'Enable Survey Access'}
                    </div>
                    {selectedQuestion && (
                        <>
                            <div className="space-y-2">
                                <div className="text-sm tracking-wider font-semibold">question type</div>
                                <div className="relative">
                                    <div onClick={isQuestionTypeDropdwon.toggle} className=" text-sm tracking-wider p-2 rounded-md border flex flex-row items-center justify-between hover:border-black hover:bg-gray-100 cursor-pointer">
                                        <div>{selectedQuestion.questiontype}</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                    {isQuestionTypeDropdwon.isOpen && (
                                        <div className="absolute border rounded-sm top-full mt-1 p-1 bg-white z-50 w-full text-sm">
                                            <div className="space-y-1">
                                                {questionTypes.map(type => (
                                                    <div onClick={() => handleUpdateQuestionType(selectedQuestion._id, type.name)} className="p-1 flex flex-row items-center space-x-2 hover:bg-gray-200 cursor-pointer" key={type.name}>
                                                        <div className="p-1 bg-black text-white">{type.icon}</div>
                                                        <div>{type.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm tracking-wider font-semibold">question options</div>
                                <div className="text-sm tracking-wider flex flex-row items-center justify-between">
                                    <div>Required</div>
                                    <label htmlFor="check" className={`relative w-12 h-6 rounded-full ${isQuestionRequired ? 'bg-green-500': 'bg-gray-300'} transition-colors duration-500 cursor-pointer`}>
                                        <input type="checkbox" id="check" className="sr-only peer" checked={isQuestionRequired} onChange={() => handleQuestionRequiredChange(selectedQuestion._id)}/>
                                        <span className={`w-4/12 h-4/6 bg-white absolute rounded-full left-1 top-1 ${isQuestionRequired ? 'peer-checked:left-7' : ''} transition-all duration-500`}></span>
                                    </label>
                                </div>
                                <div>
                                    
                                </div>
                            </div>
                        </>
                    )}
                        
                </div>
            </div>
            <Popup isOpen={questionTypesPopup.isOpen} onClose={questionTypesPopup.toggle}>
                <div className="flex flex-col space-y-4">
                    <div>
                        <div className="font-semibold text-sm">Select question type</div>
                    </div>
                    <div className="flex flex-col space-y-4">
                        {questionTypes.map(type => (
                            <button onClick={() => handleAddQuestion(type.name)} className="rounded-sm text-sm tracking-wide border bg-gray-50 hover:bg-gray-300 py-1 pl-2 pr-60" key={type.name}>
                                <div className="flex flex-row items-center space-x-2">
                                    <div className="p-1 bg-black text-white rounded-sm">{type.icon}</div>
                                    <div className="">{type.name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default Survey;