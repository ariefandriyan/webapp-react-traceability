import { useState } from 'react';
import { AuthController } from '../controllers/authController';
import { LoginCredentials, AuthState } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await AuthController.login(credentials);
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Login failed',
          isAuthenticated: false,
        }));
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await AuthController.loginWithGoogle();
      
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Google login failed',
          isAuthenticated: false,
        }));
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await AuthController.logout();
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      // Even if logout fails, clear the local state
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
    }
  };

  const validateSession = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await AuthController.validateSession();
      
      if (result.isValid && result.user) {
        setAuthState({
          user: result.user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
          isAuthenticated: false,
        });
      }
      
      return result.isValid;
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
      return false;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    loginWithGoogle,
    logout,
    validateSession,
    clearError,
  };
};
