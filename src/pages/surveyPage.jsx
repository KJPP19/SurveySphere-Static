import NavBar from "../components/navbar/navbar";
import Popup from "../components/popup/popup";
import useAuth from "../hooks/useAuth";
import useToggle from "../hooks/useToggle";
import updateArrayItemsById from "../utils/helpers/updateArrayState";
import { useParams, useLocation } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { fetchSurveyDetail } from "../services/api/apiSurvey";
import { createNewQuestion, fetchQuestionDetail, updateQuestion } from "../services/api/apiQuestion"; 
import  ChoiceInput  from "../components/surveyFormInputs/editableChoiceField";
import ScaleInput from "../components/surveyFormInputs/editableScaleField";

function Survey () {
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();
    const { surveyId } = useParams();
    const location = useLocation();

    const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
    const [ questionList, setQuestionList ] = useState([]);
    const [questionTitle, setQuestionTitle] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const questionTypesPopup = useToggle(false);
    const isEditingQuestionTitle = useToggle(false);

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
        try {
            const response = await fetchQuestionDetail(questionId);
            setSelectedQuestion(response.data.data)
        } catch (error) {
            handleSessionExpiration(error);
        }
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

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsQuestionsLoading(true);
                const response = await fetchSurveyDetail(surveyId);
                setQuestionList(response.data.data.questions);
            } catch (error) {
                handleSessionExpiration(error);
            } finally {
                setIsQuestionsLoading(false);
            }
        };

        fetchQuestions();
    }, [surveyId])

    return (
        <div className="h-screen w-screen">
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
                    <div>
                        {isQuestionsLoading ? ("loading...."
                        ) : (
                            <div className="flex flex-col space-y-2">
                                {questionList.map((question, index) => (
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
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grow p-24 bg-gray-50">
                    {selectedQuestion && (
                        <div className="shadow-md overflow-y-auto bg-white h-full w-full p-16 space-y-16">
                            <div>    
                                {isEditingQuestionTitle.isOpen ? (
                                    <input autoFocus value={questionTitle} onChange={(e) => setQuestionTitle(e.target.value)} onBlur={() => handleUpdateQuestionTitle(selectedQuestion._id)} className="border-b text-md tracking-wider rounded-md p-2 focus:outline-none w-full"/>
                                ) : (
                                    <button className="text-justify border-b text-md tracking-wider p-2 hover:border-b-black w-full" onClick={() => {selectedQuestion.title && setQuestionTitle(selectedQuestion.title); isEditingQuestionTitle.toggle()}}>
                                        {selectedQuestion.title ? (
                                            selectedQuestion.title
                                        ) : (
                                            <div>Put your question here</div>
                                        )}
                                    </button>
                                )}
                            </div>
                            <div>
                                {selectedQuestion.questiontype === 'form' && (
                                    <input disabled className="border p-2 w-full focus:outline-none" type="text" placeholder="Your Answer Here."/> 
                                )}
                                {selectedQuestion.questiontype === 'essay' && (
                                    <textarea disabled className="border p-2 w-full focus:outline-none" placeholder="Your Answer Here."/>
                                )}
                                {selectedQuestion.questiontype === 'choice' && <ChoiceInput question={selectedQuestion}/>}
                                {selectedQuestion.questiontype === 'scale' && <ScaleInput question={selectedQuestion}/>}
                            </div>

                        </div>
                    )}
                </div>
                <div className="p-4 border-l w-1/5 flex-none">
                    <div>right bar</div>
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