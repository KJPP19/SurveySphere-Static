import api from "./apiConfig";

const createNewSurvey = async (surveyData) => {
    return api.post("/surveys", surveyData)
};

const fetchSurveyDetail = async (surveyId) => {
    return api.get(`/surveys/${surveyId}`)
};

const enableSurvey = async (surveyId, value) => {
    return api.put(`/surveys/${surveyId}`, {isEnabled: value})
};

export { createNewSurvey, fetchSurveyDetail, enableSurvey };