/* eslint-disable react-hooks/exhaustive-deps */
import {getWorkspaceList, createNewWorkspace, getWorkspaceDetail, getSearchWorkspace, updateWorkspace, deleteWorkspace, getSortedSurveysByWorkspace} from "../services/api/apiWorkspace";
import { createNewSurvey } from "../services/api/apiSurvey";
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import useToggle from "../hooks/useToggle";
import useDebounce from "../hooks/useDebounce";
import NavBar from "../components/navbar/navbar";
import Popup from "../components/popup/popup";
import EditableField from "../components/button/editableField";
import updateArrayItemsById from "../utils/helpers/updateArrayState";
import { useEffect, useState } from "react";

function Workspace () {
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState([]);
    const [workspaceName, setWorkspaceName] = useState('');
    const [surveyName, setSurveyName] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isCreateSurveyLoading, setIsCreateSurveyLoading] = useState(false);
    const createWorkspacePopup = useToggle(false);
    const createSurveyPopup = useToggle(false);
    const searchPopup = useToggle(false);
    const workspaceDropdown = useToggle(false);
    const sortbyDropDown = useToggle(false);
    const isEditing = useToggle(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 1000);
    const [searchResults, setSearchResults] = useState([]);
    const [sortLabel, setSortLabel] = useState('Sort by');
    const { deauthenticateUser, isAuthenticated, getUserFromLocalStorage } = useAuth();

    const sortOptions = [
      {value: 'az', label: 'A-Z'},
      {value: 'za', label: 'Z-A'},
      {value: 'newest', label: 'Newest'},
      {value: 'oldest', label: 'Oldest'},
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
        setSelectedWorkspace(response.data.data);
        console.log("new workspace", response.data.data);
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
          setWorkspaces(prevWorkspaces => updateArrayItemsById(prevWorkspaces, response.data.data._id, response.data.data));
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

    const handleCreateNewSurvey = async (workspaceId) => {
      try {
        setIsCreateSurveyLoading(true);
        const surveyData = {title: surveyName, workspaceId: workspaceId}
        const response = await createNewSurvey(surveyData);
        const surveyId = response.data.data._id;
        navigate(`/surveys/${surveyId}/create`);
      } catch (error) {
        console.error();
      } finally {
        setIsCreateSurveyLoading(false);
      }
    };

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

    const handleSortOptionChange = async (workspaceId, value, label) => {
      try {
        setSortLabel(label);
        const response = await getSortedSurveysByWorkspace(workspaceId, value);
        setSelectedWorkspace(response.data.data)
      } catch (error) {
        handleSessionExpiration(error);
      } finally {
        sortbyDropDown.toggle();
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
            const workspaceList = response.data.data;
            if(workspaceList.length > 0) {
              setSelectedWorkspace(workspaceList[0]);
            } else {
              setSelectedWorkspace(null);
            }
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
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        <NavBar isAuthenticated={isAuthenticated} onLogout={deauthenticateUser} userInfo={getUserFromLocalStorage()}/>
          <div className="flex flex-row font-raleway">
            <div className="border border-t-0 h-screen p-4 space-y-6 sm:w-1/2 md:w-1/3 lg:w-1/5 bg-white">
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
                <div className="font-semibold text-sm flex items-center space-x-1">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                    </svg>
                  </div>
                  <div>Workspace</div>
                </div>
                <button onClick={createWorkspacePopup.toggle} className="border p-1 rounded-sm text-[#848484] bg-gray-100 hover:border-black hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
              <div className="h-full">
                <div className="h-4/6 overflow-auto">
                  {isWorkspaceLoading ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
                      <div className="border-gray-300 h-10 w-10 animate-spin rounded-full border-2 border-t-black"></div>
                    </div>
                  ) : (
                    <ul className="text-sm rounded-sm tracking-wide">
                      {workspaces.map(workspace => (
                        <li className={`p-2 text-[#848484] cursor-pointer tracking-wider truncate rounded-sm ${selectedWorkspace && selectedWorkspace._id === workspace._id ? 'bg-gray-200 text-black font-semibold' : 'hover:bg-gray-50'}`} key={workspace._id} onClick={() => handleWorkspaceClick(workspace._id)}>{workspace.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="py-4 flex flex-row items-center space-x-5">
                  <div className="rounded-full p-2 bg-gray-100 font-semibold">{getUserFromLocalStorage().initials}</div>
                  <div className="tracking-wide">
                    <div className="font-semibold text-sm">{getUserFromLocalStorage().email}</div>
                    <div className="text-sm text-gray-500">{getUserFromLocalStorage().name}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 md:px-10 md:py-5 lg:px-16 lg:py-8 w-screen h-full">
              {selectedWorkspace ? (
                <>
                  <div className="divide-y h-full">
                    <div className="space-y-20 mb-6">
                      <div className="flex flex-row items-center md:space-x-10">
                          <EditableField 
                            isEditing={isEditing} 
                            value={workspaceName} 
                            inputChange={(e) => setWorkspaceName(e.target.value)} 
                            onFinishEditing={() => handleUpdateWorkspaceName(selectedWorkspace._id)} 
                            handleButtonClick={() => {setWorkspaceName(selectedWorkspace.name); isEditing.toggle()}} buttonText={selectedWorkspace.name}
                          />
                          <div className="relative">
                            <button onClick={workspaceDropdown.toggle} className="text-gray-500 rounded-md p-2 hover:text-black hover:bg-gray-100">
                              <svg className="w-6 h-6 rotate-[180deg]"xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                              </svg>
                            </button>
                            {workspaceDropdown.isOpen && (
                              <div className="absolute left-0 border rounded-md bg-white shadow-sm  divide-y">
                                <div onClick={() => {setWorkspaceName(selectedWorkspace.name), isEditing.toggle(), workspaceDropdown.toggle()}} className="text-xs text-gray-500 tracking-wider cursor-pointer flex items-center space-x-2 py-2 px-6 hover:bg-gray-200 hover:text-black">
                                  <div>
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24"  height="24"   viewBox="0 0 20 20" fill="currentColor">  
                                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
                                    </svg>
                                  </div>
                                  <div>rename</div>
                                </div>
                                <div onClick={() => {handleDeleteWorkspace(selectedWorkspace._id), workspaceDropdown.toggle()}} className="text-xs text-gray-500 tracking-wider cursor-pointer flex items-center space-x-2 py-2 px-6 hover:bg-gray-200 hover:text-red-700">
                                  <div>
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24"  height="24"   viewBox="0 0 20 20" fill="currentColor">  
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                  </div>
                                  <div>delete</div>
                                </div>
                            </div>
                            )}
                          </div>
                      </div>
                      <div className="flex flex-row items-center justify-between">
                        <button onClick={createSurveyPopup.toggle} className="text-white bg-black py-2 px-3 font-semibold rounded-md hover:opacity-70 tracking-wider text-sm">Create new survey</button>
                        <div className="relative">
                          <button onClick={sortbyDropDown.toggle} className="bg-gray-100 text-[#848484] px-3 py-2 rounded-md tracking-wide flex flex-row items-center space-x-10 text-sm border  hover:border-black hover:text-black cursor-pointer">
                            <div>
                              {sortLabel}
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                              </svg>
                            </div>
                          </button>
                          {sortbyDropDown.isOpen && (
                              <div className="absolute top-10 left-0 border rounded-md shadow-sm w-full z-50 divide-y bg-white">
                                {sortOptions.map((option) => (
                                  <div onClick={() => handleSortOptionChange(selectedWorkspace._id, option.value, option.label)} className="p-2 text-sm text-gray-500 tracking-wider cursor-pointer hover:text-black hover:bg-gray-100" key={option.value}>{option.label}</div>
                                ))}
                              </div>
                            )}
                        </div>  
                      </div>  
                    </div>
                    <div className="py-4 h-2/3">
                      {selectedWorkspace.survey.length === 0 ? (
                        <div className="flex flex-col justify-center items-center space-y-3">
                           <svg className="w-20 h-20 text-gray-400"xmlns="http://www.w3.org/2000/svg" width="24"  height="24"  viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                            <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M15 21h-9a3 3 0 0 1 -3 -3v-1h10v2a2 2 0 0 0 4 0v-14a2 2 0 1 1 2 2h-2m2 -4h-11a3 3 0 0 0 -3 3v11" />  <line x1="9" y1="7" x2="13" y2="7" />  <line x1="9" y1="11" x2="13" y2="11" />
                           </svg>
                          <div className="text-lg text-gray-400">This workspace is empty, create new survey and get productive.</div>
                          <button onClick={createSurveyPopup.toggle} className="text-white bg-black py-2 px-3 font-semibold rounded-md hover:opacity-70 tracking-wider text-sm">Create new survey</button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl-grid-cols-5 gap-3">
                        {selectedWorkspace.survey.map(survey => (
                          <div onClick={() => {navigate(`/surveys/${survey._id}/create`)}} className="border p-3 flex flex-col space-y-10 justify-between font-semibold text-sm rounded-md hover:shadow-md cursor-pointer bg-gray-50" key={survey._id}>
                            <div>
                              <div className="flex flex-row justify-between items-center">
                                {survey.isEnabled ? (
                                  <div className="text-xs rounded-md text-green-600 py-1 px-2 bg-green-100 w-fit">enabled</div>
                                ) : (
                                  <div className="text-xs rounded-md text-gray-400 py-1 px-2 bg-gray-100 w-fit">disabled</div>
                                )}
                                <div className="text-xs font-normal text-gray-400">{timePassed(survey.createdAt)}</div>
                              </div>
                              <div className="truncate">{survey.title}</div>
                            </div>
                            <div className="text-gray-500 font-normal text-xs tracking-wide">responses: {survey.numberOfResponses}</div>
                          </div>
                        ))}
                      </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center h-1/2 space-y-3">
                    <svg className="text-gray-400 w-20 h-20"xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"/>
                    </svg>
                    <div className="text-lg text-gray-400">Looks like you do not have a workspace, get started by creating workspace</div>
                    <button onClick={createWorkspacePopup.toggle} className="text-white bg-black py-2 px-3 font-semibold rounded-md hover:opacity-70">Create New Workspace</button>
                </div>
              )}
            </div>
          </div>
        <Popup isOpen={createWorkspacePopup.isOpen} onClose={createWorkspacePopup.toggle}>
          <div className="flex flex-col space-y-3">
            <div className="font-semibold text-xl">create new workspace</div>
            <div className="flex flex-col items-center space-y-5">
              <input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="new workspace" className="border p-2 text-md rounded-sm w-96 focus:outline-none focus:border-[#000000]"/>
              <button onClick={handleCreateNewWorkspace} className="py-2 px-6 bg-black text-white text-sm font-semibold tracking-wider rounded-sm self-end hover:bg-[#3d3d3d] disabled:opacity-10" disabled={!workspaceName}>Create Workspace</button>
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
              <input value={surveyName} onChange={(e) => setSurveyName(e.target.value)} placeholder="survey title" className="border p-2 text-md rounded-sm w-96 focus:outline-none focus:border-[#000000]"/>
              <button onClick={() => handleCreateNewSurvey(selectedWorkspace._id)} className="py-2 px-6 bg-black text-white text-sm font-semibold tracking-wider rounded-sm self-end hover:bg-[#3d3d3d] disabled:opacity-10" disabled={!surveyName}>Proceed</button>
            </div>
          </div>
        </Popup>
      </div>
    )
}

export default Workspace;