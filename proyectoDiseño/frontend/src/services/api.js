import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getProducts = () => api.get('/api/products');
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createProduct = (product) => api.post('/api/products', product);
export const updateProduct = (id, product) => api.put(`/api/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
export const getTransactions = () => api.get('/api/transactions');
export const createTransaction = (transaction) => api.post('/api/transactions', transaction);

export default api;
