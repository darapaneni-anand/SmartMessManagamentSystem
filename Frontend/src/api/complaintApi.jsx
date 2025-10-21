import axios from "axios";

const API_URL = "http://localhost:5000/api/complaints";

export const getAllComplaints = () => {
  return axios.get(API_URL);
};

export const addComplaint = (data) => {
  return axios.post(API_URL, data);
};

export const updateComplaintStatus = (id, status) => {
  return axios.put(`${API_URL}/${id}`, { status });
};
