import {getWorkspaceList, createNewWorkspace, getWorkspaceDetail} from "../services/api/apiWorkspace";
import useAuth from "../hooks/useAuth";
import NavBar from "../components/navbar/navbar";
import Popup from "../components/popup/popup";
import { useEffect, useState } from "react";

function Workspace () {
    const [workspaces, setWorkspaces] = useState([]);
    const [workspaceName, setWorkspaceName] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateWorkspacePopupOpen, setIsCreateWorkspacePopupOpen] = useState(false);
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();

    const toggleCreateWorkspacePopup = () => {
      setIsCreateWorkspacePopupOpen(!isCreateWorkspacePopupOpen);
    };

    const handleCreateNewWorkspace = async () => {
      try {
        const response = await createNewWorkspace(workspaceName);
        setWorkspaces([...workspaces, response.data.data])
        console.log("new workspace", response.data);
        toggleCreateWorkspacePopup();
      } catch (error) {
        console.error("faile to create workspace", error);
      } 
    };

    const handleWorkspaceClick = async (workspaceId) => {
      try {
        const response = await getWorkspaceDetail(workspaceId);
        setSelectedWorkspace(response.data.data);
      } catch (error) {
        console.error('error fetching workspace detail', error);
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
            <div className="border border-t-0 h-screen p-4 space-y-6 w-1/5">
              <div>
                <button className="flex flex-row items-center text-sm border px-6 py-1 bg-gray-100 text-[#848484] hover:border-black hover:text-black">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                  <div>Workspace or Survey</div>
                </button>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="font-semibold text-sm">Workspace</div>
                <button onClick={toggleCreateWorkspacePopup} className="border p-1 rounded-sm text-[#848484] bg-gray-100 hover:border-black hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              <div className="divide-y">
                <div className="h-96 overflow-auto">
                  {isLoading ? ("loading...."
                  ) : (
                    <ul className="text-sm tracking-wide">
                      {workspaces.map(workspace => (
                        <li className={`p-1 text-[#848484] cursor-pointer ${selectedWorkspace && selectedWorkspace._id === workspace._id ? 'bg-gray-200 text-black' : 'hover:bg-gray-100'}`} key={workspace._id} onClick={() => handleWorkspaceClick(workspace._id)}>{workspace.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>submenu</div>
                </div>
            </div>
            <div className="px-10 py-5 w-screen">
              {selectedWorkspace && (
                <>
                  <div className="divide-y">
                    <div className="space-y-20 mb-6">
                      <div className="flex flex-row items-center space-x-10">
                          <div className="font-semibold text-lg tracking-wider">
                            {selectedWorkspace.name}
                          </div>
                          <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                          </button>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <button className="px-3 py-2 font-semibold bg-black text-white text-sm tracking-wide rounded-sm hover:bg-[#3d3d3d]">Create new survey</button>
                        <div className="bg-gray-100 text-[#848484] px-3 py-2 rounded-sm tracking-wide flex flex-row items-center space-x-10 text-sm border  hover:border-black hover:text-black cursor-pointer">
                          <div>
                            Filter
                          </div>
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </div>
                      </div>  
                    </div>
                    <div className="py-4">
                      <ul className="grid grid-cols-7 gap-3">
                        {selectedWorkspace.survey.map(survey => (
                          <li className="border p-3 font-semibold text-sm rounded-md hover:shadow-md" key={survey._id}>{survey.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        <Popup isOpen={isCreateWorkspacePopupOpen} onClose={toggleCreateWorkspacePopup}>
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