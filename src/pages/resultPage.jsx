import NavBar from "../components/navbar/navbar";
import useAuth from "../hooks/useAuth";
import { useParams, useLocation } from "react-router-dom";
import { getResultSummary } from "../services/api/apiResult";
import { useState, useEffect } from "react"; 

function Results () {
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();
    const { surveyId } = useParams();
    const location = useLocation();
    const [ selectedSubMenu, setSelectedSubMenu ] = useState('summary');
    const [ resultSummary, setResultSummary ] = useState([]);
    const [ isSummaryLoading, setIsSummaryLoading ] = useState(false);
    const options = [
        {id:'workspace', name:'Workspace', link: '/workspace'},
        {id:'create', name:'Create', link: `/surveys/${surveyId}/create`},
        {id:'share', name:'Share', link: `/surveys/${surveyId}/share`},
        {id:'results', name:'Results', link: `/surveys/${surveyId}/results`},
    ];

    const timePassed = (date) => {
        const answeredAtDate = new Date(date);
        const currentDate = new Date();
        const timeDifference = currentDate - answeredAtDate;
        const minutesPassed = Math.floor(timeDifference/(1000*60));
        const hoursPassed = Math.floor(timeDifference/(1000*60*60));
        const daysPassed = Math.floor(timeDifference/(1000*60*60*24));

        if(daysPassed > 0) {
            return `${daysPassed} day/s ago`;
        } else if (hoursPassed > 0) {
            return `${hoursPassed} hour/s ago`;
        } else {
            return `${minutesPassed} minute/s ago`;
        }
    };

    const choicePercentage = (total, choiceCount) => {
        const percentage = (choiceCount / total) * 100;
        return Math.round(percentage);
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setIsSummaryLoading(true);
                const response = await getResultSummary(surveyId);
                setResultSummary(response.data.data.responses);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSummaryLoading(false);
            }
        }

        fetchSummary();

    }, [surveyId])

    return (
        <div className="h-screen w-screen overflow-hidden font-raleway">
            <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()} menuItems={options} currentPath={location.pathname}/>
            <div className="w-full border-b p-2 flex justify-center space-x-4">
                <button onClick={() => setSelectedSubMenu('summary')} className={`p-1 text-sm ${selectedSubMenu && selectedSubMenu === 'summary' ? ' border-b border-b-black' : 'text-gray-500 border-b border-b-gray-100'}`}>Summary</button>
                <button onClick={() => setSelectedSubMenu('table')} className={`p-1 text-sm ${selectedSubMenu && selectedSubMenu === 'table' ? ' border-b border-b-black' : 'text-gray-500 border-b border-b-gray-100'}`}>Table</button>
            </div>
            <div className="overflow-y-auto h-5/6">
                {selectedSubMenu === 'summary' && (
                    <div className="w-full py-10 space-y-6 flex flex-col justify-center items-center">
                        <div className="font-semibold text-3xl tracking-wider">Summary</div>
                        <div className="w-1/2 space-y-3">
                            {isSummaryLoading ? (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-white opacity-80">
                                <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-black"></div>
                            </div>
                            ) : (
                                <>
                                    {resultSummary.map((result, index) => (
                                        <div className="rounded-md shadow-md p-3 bg-white" key={index}>
                                            <div className="font-semibold tracking-wide flex flex-row items-center justify-between">
                                                <div>{result.questionData.title}</div>
                                                <div className="text-xs text-gray-500">{result.answers.length} Total Responses</div>
                                            </div>
                                            <div>
                                                {result.questionData.questiontype === 'form' && (
                                                    <div className="p-2 space-y-4">
                                                        {result.answers.map((answer, index) => (
                                                            <div className="flex items-center justify-between" key={index}>
                                                                <div className="text-sm text-gray-700">{answer.value}</div>
                                                                <div className="text-xs text-gray-400">{timePassed(answer.answeredAt)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {result.questionData.questiontype === 'essay' && (
                                                    <div className="p-2 space-y-4">
                                                        {result.answers.map((answer, index) => (
                                                            <div className="flex items-center justify-between" key={index}>
                                                                <div className="text-sm text-gray-700">{answer.value}</div>
                                                                <div className="text-xs text-gray-400">{timePassed(answer.answeredAt)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {result.questionData.questiontype === 'choice' && (
                                                    <div className="p-2 space-y-4">
                                                        {result.questionData.labels.map((label, labelIndex) => {
                                                            const choiceCount = result.answers.filter(answer => answer.value === label).length;
                                                            const totalResponses = result.answers.length;
                                                            const percentage = choicePercentage(totalResponses, choiceCount);
                                                            return (
                                                                <div className="flex items-center space-x-4" key={labelIndex}>
                                                                    <div className="text-sm text-gray-700 flex-1">{label}</div>
                                                                    <div className="text-xs text-gray-400 flex-1 text-right">
                                                                        {choiceCount} responses
                                                                    </div>
                                                                    <div className="w-1/2 bg-gray-200 rounded-md h-2 flex-1">
                                                                        <div className="bg-black h-full rounded-md" style={{width: `${percentage}%`}}></div>
                                                                    </div>
                                                                    <div className="text-sm text-gray-400">{percentage}%</div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}
                {selectedSubMenu === 'table' && (
                    <div>this is the table page</div>
                )}
            </div>
        </div>
    )
}

export default Results;