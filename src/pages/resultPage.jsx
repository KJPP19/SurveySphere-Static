import NavBar from "../components/navbar/navbar";
import useAuth from "../hooks/useAuth";
import { useParams, useLocation } from "react-router-dom"; 

function Results () {
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();
    const { surveyId } = useParams();
    const location = useLocation();
    const options = [
        {id:'workspace', name:'Workspace', link: '/workspace'},
        {id:'create', name:'Create', link: `/surveys/${surveyId}/create`},
        {id:'share', name:'Share', link: `/surveys/${surveyId}/share`},
        {id:'results', name:'Results', link: `/surveys/${surveyId}/results`},
    ];

    return (
        <div className="h-screen w-screen">
            <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()} menuItems={options} currentPath={location.pathname}/>
        </div>
    )
}

export default Results;