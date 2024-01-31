import api from "./apiConfig";

const getWorkspaceList = async () => {
    return api.get("/workspace");
};

const getWorkspaceDetail = async (workspaceId) => {
    return api.get(`/workspace/${workspaceId}`);
};

const createNewWorkspace = async (workspaceName) => {
    return api.post("/workspace", {name: workspaceName});
};

export {getWorkspaceList, createNewWorkspace, getWorkspaceDetail};