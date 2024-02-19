import api from "./apiConfig";

const getResultSummary = async (surveyId) => {
    return api.get(`/surveys/${surveyId}/results/summary`);
};

const getResultTable = async (surveyId) => {
    return api.get(`/surveys/${surveyId}/results/table`);
};

export {getResultSummary, getResultTable};