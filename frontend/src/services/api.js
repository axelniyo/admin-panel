import axios from 'axios';

// Smart URL detection that works for both localhost and production
const getApiBaseUrl = () => {
  const { hostname } = window.location;
  
  // If we're on localhost, use local backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // If we're on Render production, use the actual backend URL
  // REPLACE THIS WITH YOUR ACTUAL BACKEND URL FROM RENDER:
  return 'https://admin-panel-back-dhlc.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  createUser: (userData) => api.post('/users', userData),
  getUsers: () => api.get('/users'),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  exportUsers: () => api.get('/users/export', { responseType: 'arraybuffer' }),
  getUserStats: () => api.get('/users/stats'),
};

export default api;