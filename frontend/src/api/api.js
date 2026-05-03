import axios from 'axios';

const api = axios.create({
  baseURL: "https://masala-store-production.up.railway.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ADD this block after the request interceptor:
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;