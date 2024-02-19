import api from "./apiConfig";

const fetchSurveyByShareId = async(shareId) => {
    return api.get(`/surveys/data/${shareId}`);
};

const submitResponse = async(responseData) => {
    return api.post("/surveys/data/submit", responseData);
};

export {fetchSurveyByShareId, submitResponse};