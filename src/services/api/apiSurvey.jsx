import api from "./apiConfig";

const createNewSurvey = async (surveyData) => {
    return api.post("/surveys", surveyData)
};

const fetchSurveyDetail = async (surveyId) => {
    return api.get(`/surveys/${surveyId}`)
};

export { createNewSurvey, fetchSurveyDetail };