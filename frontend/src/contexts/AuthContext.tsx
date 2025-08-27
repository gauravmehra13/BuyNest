import { createContext, useState, ReactNode, useEffect } from 'react';
import { User, ErrorResponse } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const { user } = await authAPI.getCurrentUser();
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false
        }));
      } catch (error) {
        localStorage.removeItem('token'); // Clear invalid token
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user } = await authAPI.login({ email, password });
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false
      }));
      toast.success('Logged in successfully!');
    } catch (error) {
      const errorMsg = (error as ErrorResponse).message || 'Login failed';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isLoading: false
      }));
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user } = await authAPI.register({ firstName, lastName, email, password });
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false
      }));
    } catch (error) {
      const errorMsg = (error as ErrorResponse).message || 'Registration failed';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isLoading: false
      }));
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await authAPI.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      toast.success('Logged out successfully!');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Logout failed',
        isLoading: false
      }));
      toast.error('Logout failed');
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const updateUser = (user: User) => {
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: true
    }));
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, clearError, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
