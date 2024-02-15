import api from "./apiConfig";

const getResultSummary = async (surveyId) => {
    return api.get(`/surveys/${surveyId}/results/summary`);
};

export {getResultSummary};