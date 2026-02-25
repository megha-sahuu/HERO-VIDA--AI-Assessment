import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile } from '../types';
import { authService } from '../services/storageService';

interface AuthContextType {
  user: UserProfile | null;
  logout: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock user authentication
    const mockUser: UserProfile = {
      id: 'mock-user-123',
      email: 'demo@carcube.ai',
      name: 'Demo User',
      currency: 'INR',
      credits: 100,
      hasCompletedOnboarding: true
    };

    // Check if user is already logged in (simulated persistence)
    const storedAuth = localStorage.getItem('carscube_mock_auth');
    if (storedAuth === 'true') {
      setUser(mockUser);
    }

    setIsLoading(false);
  }, []);

  const login = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser: UserProfile = {
      id: 'mock-user-123',
      email: 'demo@carcube.ai',
      name: 'Demo User',
      currency: 'INR',
      credits: 100,
      hasCompletedOnboarding: true
    };
    setUser(mockUser);
    localStorage.setItem('carscube_mock_auth', 'true');
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('carscube_mock_auth');
  };

  const updateUser = (userData: UserProfile) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, isLoading } as any}>
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
