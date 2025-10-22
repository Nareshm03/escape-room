import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const register = async (email, password, name, teamName) => {
    const response = await api.post('/auth/register', { 
      email, password, name, teamName
    });
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};