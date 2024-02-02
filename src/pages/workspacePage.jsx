/* eslint-disable react-hooks/exhaustive-deps */
import {getWorkspaceList, createNewWorkspace, getWorkspaceDetail, getSearchWorkspace, updateWorkspace, deleteWorkspace} from "../services/api/apiWorkspace";
import useAuth from "../hooks/useAuth";
import useToggle from "../hooks/useToggle";
import useDebounce from "../hooks/useDebounce";
import NavBar from "../components/navbar/navbar";
import Popup from "../components/popup/popup";
import DropDown from "../components/dropdown/dropdown";
import { useEffect, useState } from "react";

function Workspace () {
    const [workspaces, setWorkspaces] = useState([]);
    const [workspaceName, setWorkspaceName] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const createWorkspacePopup = useToggle(false);
    const createSurveyPopup = useToggle(false);
    const searchPopup = useToggle(false);
    const workspaceDropdown = useToggle(false);
    const isEditing = useToggle(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 1000);
    const [searchResults, setSearchResults] = useState([]);
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();

    const handleSessionExpiration = (error) => {
      if(error.response.data.status === 401 && error.response.data.error === "your session has expired, please login again"){
        deauthenticateUser(error.response.data.error);
      }
      return error;
    };

    const handleCreateNewWorkspace = async () => {
      try {
        const response = await createNewWorkspace(workspaceName);
        setWorkspaces(prevWorkspaces => [...prevWorkspaces, response.data.data])
        console.log("new workspace", response.data);
        createWorkspacePopup.toggle();
      } catch (error) {
        handleSessionExpiration(error);
        console.error("faile to create workspace", error);
      } finally {
        setWorkspaceName('');
      }
    };

    const handleWorkspaceClick = async (workspaceId) => {
      try {
        const response = await getWorkspaceDetail(workspaceId);
        setSelectedWorkspace(response.data.data);
      } catch (error) {
        handleSessionExpiration(error);
        console.error('error fetching workspace detail', error);
      }
    };

    const handleUpdateWorkspaceName = async (workspaceId) => {
      if (workspaceName.trim() !== '') {
        try {
          const response = await updateWorkspace(workspaceId, workspaceName);
          setWorkspaces((prevWorkspaces) => {return prevWorkspaces.map((workspace) => workspace._id === response.data.data._id ? response.data.data : workspace);});
          setSelectedWorkspace(response.data.data);
        } catch (error) {
          handleSessionExpiration(error);
          console.error("error put request", error);
        } finally {
          setWorkspaceName('');
        }
      }
      isEditing.toggle();
    };

    /*const handleCreateNewSurvey = async (workspaceId) => {
      try {
        //set loading to true
        //const surveyData = {title: survaynamestate, workspaceId: workspaceId}
        //response = await createSurvey(surveyData)
        //if (response.status === 201) {const surveyId = response.data.data._id, navigate("/survey/surveyId")}
      } catch (error) {
        //console.error();
      } finally {
        //setloading to false
      }
    };*/

    const handleDeleteWorkspace = async (workspaceId) => {
      try {
        await deleteWorkspace(workspaceId);
        setWorkspaces((prevWorkspaces) => {return prevWorkspaces.filter((workspace) => workspace._id !== workspaceId);});
        setSelectedWorkspace('');
      } catch (error) {
        handleSessionExpiration(error);
        console.error("error delete request", error);
      } 
    };
    
    useEffect(() => {
      const handleSearch = async () => {
        try {
          setIsSearchLoading(true);
          const response = await getSearchWorkspace(debouncedSearchQuery);
          setSearchResults(response.data.data);
        } catch (error) {
          handleSessionExpiration(error);
        } finally {
          setIsSearchLoading(false);
        }
      };

      if (debouncedSearchQuery.trim() !== '') {
        handleSearch();
      } else {
        setSearchResults([]);
      }

    }, [debouncedSearchQuery]);

    useEffect(() => { 
      const fetchWorkspaces = async () => {
          try {
            setIsWorkspaceLoading(true);
            const response = await getWorkspaceList();
            setWorkspaces(response.data.data);
            console.log(response.data.data);
          } catch (error) {
            handleSessionExpiration(error);
            console.error("Error fetching workspaces", error.response.data);
          } finally {
            setIsWorkspaceLoading(false);
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
                <button onClick={searchPopup.toggle} className="flex flex-row items-center  justify-center w-full text-sm border px-6 py-1 bg-gray-100 text-[#848484] hover:border-black hover:text-black">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </div>
                  <div>Workspace</div>
                </button>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="font-semibold text-sm">Workspace</div>
                <button onClick={createWorkspacePopup.toggle} className="border p-1 rounded-sm text-[#848484] bg-gray-100 hover:border-black hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              <div className="divide-y">
                <div className="h-96 overflow-auto">
                  {isWorkspaceLoading ? ("loading...."
                  ) : (
                    <ul className="text-sm tracking-wide">
                      {workspaces.map(workspace => (
                        <li className={`p-1 text-[#848484] cursor-pointer ${selectedWorkspace && selectedWorkspace._id === workspace._id ? 'bg-gray-200 text-black' : 'hover:bg-gray-100'}`} key={workspace._id} onClick={() => handleWorkspaceClick(workspace._id)}>{workspace.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="h-56"></div>
                </div>
            </div>
            <div className="px-10 py-5 w-screen">
              {selectedWorkspace && (
                <>
                  <div className="divide-y">
                    <div className="space-y-20 mb-6">
                      <div className="flex flex-row items-center space-x-10">
                          {isEditing.isOpen ? (
                            <input autoFocus value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} onBlur={() => handleUpdateWorkspaceName(selectedWorkspace._id)} className="border font-semibold text-lg tracking-wider rounded-md p-2 focus:outline-none"/>
                          ) : (
                            <button onClick={() => {setWorkspaceName(selectedWorkspace.name), isEditing.toggle()}} className="border font-semibold text-lg tracking-wider rounded-md p-2 hover:bg-gray-200">
                              {selectedWorkspace.name}
                            </button>
                          )}
                          <button onClick={workspaceDropdown.toggle} className="text-gray-500 hover:text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                          </button>
                          <DropDown isOpen={workspaceDropdown.isOpen}>
                            <>
                              <div onClick={() => {setWorkspaceName(selectedWorkspace.name), isEditing.toggle(), workspaceDropdown.toggle()}} className="text-xs py-2 px-7 tracking-wider cursor-pointer hover:bg-gray-200">
                                rename
                              </div>
                              <div onClick={() => {handleDeleteWorkspace(selectedWorkspace._id), workspaceDropdown.toggle()}} className="text-xs py-2 px-7 tracking-wider cursor-pointer hover:bg-gray-200 hover:text-red-700">
                                delete
                              </div>
                            </>
                          </DropDown>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <button onClick={createSurveyPopup.toggle} className="px-3 py-2 font-semibold bg-black text-white text-sm tracking-wide rounded-sm hover:bg-[#3d3d3d]">Create new survey</button>
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
        <Popup isOpen={createWorkspacePopup.isOpen} onClose={createWorkspacePopup.toggle}>
          <div className="flex flex-col space-y-3">
            <div className="font-semibold text-xl">create new workspace</div>
            <div className="flex flex-col items-center space-y-5">
              <input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="new workspace" className="border p-2 text-md rounded-sm w-96 focus:outline-none focus:border-[#000000]"/>
              <button onClick={handleCreateNewWorkspace} className="py-2 px-6 bg-black text-white text-sm font-semibold tracking-wider rounded-sm self-end hover:bg-[#3d3d3d]">Create Workspace</button>
            </div>
          </div>
        </Popup>
        <Popup isOpen={searchPopup.isOpen} onClose={() => {setSearchQuery(''); searchPopup.toggle();}}>
          <div className="flex flex-col space-y-3">
            <div className="mt-4 space-y-2">
              <div className="font-semibold">Search Workspace</div>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="search workspace or survey" className="border p-2 text-sm rounded-sm w-96 focus:outline-none focus:border-[#000000]"/>
            </div>
            <div className="text-sm text-gray-700">
              {isSearchLoading ? (
                "searching..."
              ):(
                <ul className="space-y-1">
                  {searchResults.map(result => (
                    <li key={result._id}>{result.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Popup>
        <Popup isOpen={createSurveyPopup.isOpen} onClose={createSurveyPopup.toggle}>
          <div className="flex flex-col space-y-1">
            <div>
              <div className="font-semibold text-xl">Before you proceed,</div>
              <div className="text-md text-[#3d3d3d]">provide a survey title</div>
            </div>
            <div className="flex flex-col items-center space-y-5">
              <input placeholder="survey title" className="border p-2 text-md rounded-sm w-96 focus:outline-none focus:border-[#000000]"/>
              <button className="py-2 px-6 bg-black text-white text-sm font-semibold tracking-wider rounded-sm self-end hover:bg-[#3d3d3d]">Proceed</button>
            </div>
          </div>
        </Popup>
      </div>
    )
}

export default Workspace;