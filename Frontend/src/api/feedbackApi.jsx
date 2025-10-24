import api from './axiosConfig';

export const getFeedbackByMeal = (mealId) => {
    return api.get(`/feedback/${mealId}`);
};

export const addFeedback = (data) => {
    return api.post('/feedback', data);
};