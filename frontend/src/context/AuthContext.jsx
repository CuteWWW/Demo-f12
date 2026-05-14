import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setUser, login as apiLogin } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setAuthUser] = useState(() => getUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const res = await apiLogin(username, password);
      if (res.code === 0) {
        setAuthUser(res.data.user);
        return { success: true, data: res.data };
      }
      return { success: false, error: res.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthUser(null);
  };

  const isLoggedIn = !!user && !!getToken();

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
