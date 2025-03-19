import  { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
// Cargar la información del usuario desde localStorage al inicializar
const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
});

  useEffect(() => {
    // Cada vez que el token cambie, actualiza el usuario en localStorage
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    // Cada vez que el usuario cambie, actualiza la información en localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('user'); // Remove user
  };

  const value = {
    token,
    user,
    login,
    logout,
    isLoggedIn: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);