import axios from 'axios';

const api = axios.create({
  baseURL: "https://masala-store.onrender.com/api",
});

api.interceptors.request.use((config) => {
  // ← Check adminToken first for admin routes, then fall back to user token
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  
  const isAdminRoute = config.url?.startsWith('/admin') || config.url?.includes('/admin/');
  const token = isAdminRoute ? adminToken : (userToken || adminToken);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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