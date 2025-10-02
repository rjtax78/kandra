import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  }
}

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      toast.error('Erreur réseau — impossible de contacter le serveur');
    } else if (err.response.status === 401) {
      setToken(null);
      toast.error('Session expirée — reconnecte-toi');
      window.location.href = '/login';
    } else {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Erreur serveur';
      toast.error(msg);
    }
    return Promise.reject(err);
  }
);

export default API;
