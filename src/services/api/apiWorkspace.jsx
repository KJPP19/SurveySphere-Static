import api from "./apiConfig";

const getWorkspaceList = async () => {
    return api.get("/workspace");
};

const createNewWorkspace = async (workspaceName) => {
    return api.post("/workspace", {name: workspaceName});
};

export {getWorkspaceList, createNewWorkspace};