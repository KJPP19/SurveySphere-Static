import api from "./apiConfig";

const fetchSurveyByShareId = async(shareId) => {
    return api.get(`/surveys/data/${shareId}`);
};

export {fetchSurveyByShareId};