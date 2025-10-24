import api from "./axiosConfig";

const ENDPOINT = "/complaints";

export const getAllComplaints = () => {
  return api.get(ENDPOINT);
};

export const addComplaint = (data) => {
  return api.post(ENDPOINT, data);
};

export const updateComplaintStatus = (id, status) => {
  return api.put(`${ENDPOINT}/${id}`, { status });
};

export const getMyComplaints = () => {
  return api.get(`${ENDPOINT}/mine`);
};
