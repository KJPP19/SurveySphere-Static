import {getWorkspaceList, createNewWorkspace} from "../services/api/apiWorkspace";
import useAuth from "../hooks/useAuth";
import NavBar from "../components/navbar/navbar";
import Popup from "../components/popup/popup";
import { useEffect, useState } from "react";

function Workspace () {
    const [workspaces, setWorkspaces] = useState([]);
    const [workspaceName, setWorkspaceName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();

    const togglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    };

    const handleCreateNewWorkspace = async () => {
      try {
        const response = await createNewWorkspace(workspaceName);
        setWorkspaces([...workspaces, response.data.data])
        console.log("new workspace", response.data);
        togglePopup();
      } catch (error) {
        console.error("faile to create workspace", error);
      } 
    };
   
    useEffect(() => {
        
      const fetchWorkspaces = async () => {
          try {
            setIsLoading(true);
            const response = await getWorkspaceList();
            setWorkspaces(response.data.data);
            console.log(response.data.data);
          } catch (error) {
            if(error.response.data.status === 401 && error.response.data.error === "your session has expired, please login again"){
                deauthenticateUser(error.response.data.error);
            }
            console.error("Error fetching workspaces", error.response.data);
          } finally {
            setIsLoading(false);
          }
        };

        fetchWorkspaces();
      }, [deauthenticateUser]);

    return (
        <div className="flex flex-col h-screen">
              <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()}/>
              <div className="flex flex-row font-raleway">
                <div className="border border-t-0 h-screen p-4 space-y-6">
                  <div>
                    <button className="flex flex-row items-center justify-between text-sm border px-2 py-1 bg-gray-100 text-[#848484] hover:border-black hover:text-black">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      </div>
                      <div>Search Workspace or Survey</div>
                    </button>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div className="font-semibold text-sm">Workspace</div>
                    <button onClick={togglePopup} className="border p-1 rounded-sm text-[#848484] bg-gray-100 hover:border-black hover:text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                  {isLoading ? ("loading...."
                  ) : (
                    <ul>
                    {workspaces.map(workspace => (
                      <li key={workspace._id}>{workspace.name}</li>
                    ))}
                  </ul>
                  )}
                </div>
                <div>
                  Survey list
                </div>
              </div>
          <Popup isOpen={isPopupOpen} onClose={togglePopup}>
            <div className="flex flex-col space-y-6">
              <div className="font-semibold text-xl">create new workspace</div>
              <div className="flex flex-col items-center space-y-5">
                <input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="new workspace" className="border p-2 text-md rounded-sm w-96 focus:outline-none focus:border-[#000000]"/>
                <button onClick={handleCreateNewWorkspace} className="py-2 px-6 bg-black text-white text-sm font-semibold tracking-wider rounded-sm self-end hover:bg-[#3d3d3d]">Create Workspace</button>
              </div>
            </div>
          </Popup>
        </div>
    )
}

export default Workspace;