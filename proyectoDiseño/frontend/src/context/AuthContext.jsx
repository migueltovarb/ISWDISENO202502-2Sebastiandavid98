import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginAPI(credentials);
      setToken(response.data.token);
      setUser({ email: credentials.email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await registerAPI(userData);
      setToken(response.data.token);
      setUser({ email: userData.email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Error al registrarse' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
