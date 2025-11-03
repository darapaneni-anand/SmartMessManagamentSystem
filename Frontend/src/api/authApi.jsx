import api from './axiosConfig';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const getProfile = () => {
  return api.get('/auth/profile');
};

export const updateProfile = (updates) => {
  return api.patch('/auth/profile', updates);
};

export const logout = () => {
  return api.post('/auth/logout');
};