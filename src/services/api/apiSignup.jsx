import api from "./apiConfig";

const signup = async (registerFormData) => {
    return api.post("/register", registerFormData);
};

export default signup;