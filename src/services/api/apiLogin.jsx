import api from "./apiConfig";

const login = async (loginFormData) => {
    return api.post("/login", loginFormData);
};

export default login;