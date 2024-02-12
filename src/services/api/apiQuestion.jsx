import api from "./apiConfig";

const createNewQuestion = async(questionData) => {
    return api.post("/questions", questionData);
};

const fetchQuestionDetail = async(questionId) => {
    return api.get(`/questions/${questionId}`);
};

const updateQuestion = async(questionId, questionTitle) => {
    return api.put(`/questions/${questionId}`, {title: questionTitle});
};

const addChoiceInQuestion = async(questionId, newChoice) => {
    return api.put(`/questions/${questionId}`, {labelstoadd: [newChoice]});
};

const deleteChoiceInQuestion = async(questionId, choiceToDelete) => {
    return api.put(`/questions/${questionId}`, {labelstoremove: [choiceToDelete]})
};

const addRangeInQuestion = async(questionId, minValue, maxValue) => {
    return api.put(`/questions/${questionId}`, {range: [minValue, maxValue]});
};

const toggleQuestionRequired = async(questionId, value) => {
    return api.put(`/questions/${questionId}`, {isRequired: value});
};

const updateQuestionType = async(questionId, questionType) => {
    return api.put(`/questions/${questionId}`, {questiontype: questionType});
};

export { createNewQuestion, fetchQuestionDetail, updateQuestion, addChoiceInQuestion, deleteChoiceInQuestion, addRangeInQuestion, toggleQuestionRequired, updateQuestionType };