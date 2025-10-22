import axios from "axios";
const API_URL = "http://localhost:5000/api/feedback"

export const getFeedbackByMeal = (mealId)=>
{
    return axios.get(`${API_URL}/${mealId}`);
};
export const addFeedback = (data)=>
{
    return axios.post(API_URL, data);
};