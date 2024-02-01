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

export {getWorkspaceList, createNewWorkspace, getWorkspaceDetail, getSearchWorkspace, updateWorkspace};