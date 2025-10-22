import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const getProfile = () => {
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const updateProfile = (updates) => {
  return axios.patch(`${API_URL}/profile`, updates, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const logout = () => {
  return axios.post(`${API_URL}/logout`, null, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};