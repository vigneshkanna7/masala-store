import React, { createContext, useState, useContext, useMemo } from 'react';


const AuthContext = createContext();

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(safeParseUser);

  const login = (userData, token) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', userData.role);          // for any direct localStorage role checks
  localStorage.setItem('user', JSON.stringify({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role
  }));
  setUser(userData);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');  // clean stale admin token too
    setUser(null);
  };

const value = useMemo(() => ({ user, login, logout }), [user]);
return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);