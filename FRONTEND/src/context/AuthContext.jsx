import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setToken(userData.token); // Assuming userData includes the token
    localStorage.setItem('user', JSON.stringify(userData));
    // localStorage.setItem('user', userData);
    // localStorage.setItem('userId', userData.userId);
    localStorage.setItem('token', userData.token); // Store token
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove token
  };

  const value = {
    isLoggedIn,
    user,
    token, 
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
