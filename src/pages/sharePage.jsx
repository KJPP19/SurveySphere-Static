import NavBar from "../components/navbar/navbar";
import useAuth from "../hooks/useAuth";
import { useParams, useLocation } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { fetchSurveyDetail } from "../services/api/apiSurvey";

function Share () {
        const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();
        const { surveyId } = useParams();
        const location = useLocation();
        const [ shareId, setShareId ] = useState(null);
        const [ copyStatus, setCopyStatus ] = useState('');
        const [ isLinkLoading, setIsLinkLoading ] = useState(false);
        const [ isSurveyEnabled, setIsSurveyEnabled ] = useState(false);
        const publicSurveyLink = `http://localhost:5173/survey/public/${shareId}`;

        const options = [
            {id:'workspace', name:'Workspace', link: '/workspace'},
            {id:'create', name:'Create', link: `/surveys/${surveyId}/create`},
            {id:'share', name:'Share', link: `/surveys/${surveyId}/share`},
            {id:'results', name:'Results', link: `/surveys/${surveyId}/results`},
        ];

        const handleSessionExpiration = (error) => {
            if(error.response.data.status === 401 && error.response.data.error === "your session has expired, please login again"){
              deauthenticateUser(error.response.data.error);
            }
            return error;
          };

        const copyLinkToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(publicSurveyLink);
                setCopyStatus('success');
            } catch (error) {
                console.error("failed to copy link", error);
                setCopyStatus('failed');
            }
        };

        useEffect(() => {
            const fetchSurveyShareId = async () => {
                try {
                    setIsLinkLoading(true);
                    const response = await fetchSurveyDetail(surveyId);
                    setShareId(response.data.data.shareableSurveyId);
                    setIsSurveyEnabled(response.data.data.isEnabled);
                } catch (error) {
                    handleSessionExpiration(error);
                } finally {
                    setIsLinkLoading(false);
                }
            };
            
            fetchSurveyShareId();
        }, [surveyId])

    return (
        <div className="h-screen w-screen font-raleway">
            <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()} menuItems={options} currentPath={location.pathname}/>
            {isLinkLoading ? (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-white opacity-80">
                    <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-black"></div>
              </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-2/4 space-y-10">
                    {!isSurveyEnabled && (
                    <div className="text-xs flex flex-row items-center space-x-3 text-gray-500 bg-gray-100 border p-4 rounded-md w-1/3">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <div className="text-justify tracking-wider">Survey access is currently disabled. You must enable it first before copying the link. Enabling survey access allows users to respond. Without enabling, they cannot access or answer it. Remember to enable before sharing the link.</div>
                    </div>
                    )}
                    <div className="flex flex-row items-center space-x-1">
                        <div className="border border-black rounded-md py-2 px-4">{publicSurveyLink}</div>
                        <div>
                            <button onClick={copyLinkToClipboard} disabled={!isSurveyEnabled} className={`text-sm border p-3 rounded-md ${copyStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-black text-white'} transition-all duration-500 font-semibold tracking-wider hover:opacity-55 disabled:opacity-20`}>
                                {copyStatus === 'success' ? 'Link Copied' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            


        </div>
    )
}

export default Share;