import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDb } from '../services/mockDb';
import type { User } from '../services/mockDb';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string, fullName?: string, mobile?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize DB and load active session from localStorage
  useEffect(() => {
    mockDb.init();
    const storedUser = localStorage.getItem('nsmf_active_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password?: string,
    fullName?: string,
    mobile?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    // Artificial delay to simulate network call & Framer loading triggers
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const emailLower = email.toLowerCase().trim();

      // 1. Admin login verification
      if (emailLower === 'admin@nayaksairam.com') {
        if (password === 'admin123') {
          const adminUser: User = {
            id: 'u-admin',
            email: 'admin@nayaksairam.com',
            fullName: 'NSMF Admin Core',
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          setUser(adminUser);
          localStorage.setItem('nsmf_active_user', JSON.stringify(adminUser));
          setIsLoading(false);
          return true;
        } else {
          setAuthError('Invalid administrator credentials.');
          setIsLoading(false);
          return false;
        }
      }

      // 2. Customer login / registration
      const existingUsers = mockDb.getUsers();
      const existingUser = existingUsers.find((u) => u.email.toLowerCase() === emailLower);

      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('nsmf_active_user', JSON.stringify(existingUser));
        setIsLoading(false);
        return true;
      } else {
        // If user doesn't exist, we register them as a new customer
        const nameToUse = fullName || email.split('@')[0];
        const registered = mockDb.registerUser(emailLower, nameToUse, mobile || '', 'customer');
        setUser(registered);
        localStorage.setItem('nsmf_active_user', JSON.stringify(registered));
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      setAuthError('An authentication error occurred. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nsmf_active_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        isLoading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
