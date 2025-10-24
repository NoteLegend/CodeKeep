import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAppStore from '../store/useAppStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAppStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    user, 
    token, 
    isAuthenticated, 
    setUser, 
    setToken, 
    logout, 
    setError,
    setLoading 
  } = useAppStore();

  // Check if user is authenticated on mount
  useEffect(() => {
    if (token && !user) {
      getCurrentUser();
    }
  }, [token, user]);

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to get current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    loading: useAppStore((state) => state.loading),
    error: useAppStore((state) => state.error),
    login,
    register,
    logout: handleLogout,
    clearError: () => setError(null)
  };
};

export default useAuth;
