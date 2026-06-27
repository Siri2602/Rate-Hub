import axios from 'axios';

const API_URL = 'https://ratehub-backend-knt7.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ratehub-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ratehub-token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
};

// Users
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  create: (data) => api.post('/users', data),
};

// Stores
export const storesAPI = {
  getAll: (params) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
  getMyStore: () => api.get('/stores/my'),
};

// Ratings
export const ratingsAPI = {
  getAll: (params) => api.get('/ratings', { params }),
  getByStore: (storeId, params) => api.get(`/ratings/store/${storeId}`, { params }),
  submit: (data) => api.post('/ratings', data),
  update: (id, data) => api.put(`/ratings/${id}`, data),
  delete: (id) => api.delete(`/ratings/${id}`),
  getUserRatings: () => api.get('/ratings/user'),
};

// Dashboard
export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getOwnerStats: () => api.get('/dashboard/owner'),
  getUserStats: () => api.get('/dashboard/user'),
};
