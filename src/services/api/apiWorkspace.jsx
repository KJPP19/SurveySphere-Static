import api from "./apiConfig";

const getWorkspaceList = async () => {
    return api.get("/workspace");
};

const getWorkspaceDetail = async (workspaceId) => {
    return api.get(`/workspace/${workspaceId}`);
};

const getSearchWorkspace = async (item) => {
    return api.get(`/workspace?search=${item}`);
};

const createNewWorkspace = async (workspaceName) => {
    return api.post("/workspace", {name: workspaceName});
};

const updateWorkspace = async (workspaceId, workspaceName) => {
    return api.put(`/workspace/${workspaceId}`, {name: workspaceName});
};

const deleteWorkspace = async (workspaceId) => {
    return api.delete(`/workspace/${workspaceId}`);
};

const getSortedSurveysByWorkspace = async (workspaceId, sortOption) => {
    return api.get(`/workspace/${workspaceId}?sort=${sortOption}`);
};

export {getWorkspaceList, createNewWorkspace, getWorkspaceDetail, getSearchWorkspace, updateWorkspace, deleteWorkspace, getSortedSurveysByWorkspace};