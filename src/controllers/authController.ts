import { AuthService } from '../services/authService';
import { LoginCredentials, User } from '../types/auth';

export class AuthController {
  /**
   * Handle user login with email and password
   */
  static async login(credentials: LoginCredentials): Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }> {
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email and password are required',
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      // Call authentication service
      const response = await AuthService.login(credentials);
      
      // Store token based on remember me preference
      if (response.token) {
        if (credentials.rememberMe) {
          localStorage.setItem('auth_token', response.token);
        } else {
          sessionStorage.setItem('auth_token', response.token);
        }
      }

      return {
        success: true,
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Handle Google OAuth login
   */
  static async loginWithGoogle(): Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }> {
    try {
      // In a real implementation, this would handle Google OAuth flow
      // For now, we'll simulate the process
      
      // TODO: Implement actual Google OAuth
      // 1. Initialize Google OAuth client
      // 2. Get authorization code
      // 3. Exchange code for tokens
      // 4. Get user profile
      // 5. Authenticate with backend
      
      console.log('Initiating Google OAuth...');
      
      // Simulate Google OAuth response
      const mockResponse = await new Promise<any>((resolve) => {
        setTimeout(() => {
          // Simulate successful Google login
          resolve({
            user: {
              id: 'google_user_123',
              email: 'user@example.com',
              name: 'John Doe',
            },
            token: 'mock_google_token_123',
          });
        }, 2000);
      });

      // Store token
      localStorage.setItem('auth_token', mockResponse.token);

      return {
        success: true,
        user: mockResponse.user,
        token: mockResponse.token,
      };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google login failed. Please try again.',
      };
    }
  }

  /**
   * Handle user logout
   */
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      // Call logout service to invalidate token on server
      await AuthService.logout();
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear local tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      return {
        success: true, // Return success since local cleanup is done
        error: 'Logout completed locally, but server notification failed',
      };
    }
  }

  /**
   * Validate current session
   */
  static async validateSession(): Promise<{
    isValid: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        return { isValid: false };
      }

      // Validate token with server
      const isValid = await AuthService.validateToken();
      
      if (!isValid) {
        // Clear invalid token
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        return { isValid: false };
      }

      // TODO: Get user info from token or make separate API call
      // For now, return basic validation
      return { isValid: true };
    } catch (error) {
      console.error('Session validation error:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Session validation failed',
      };
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    try {
      const response = await AuthService.refreshToken();
      
      // Update stored token
      const wasInLocalStorage = !!localStorage.getItem('auth_token');
      if (wasInLocalStorage) {
        localStorage.setItem('auth_token', response.token);
      } else {
        sessionStorage.setItem('auth_token', response.token);
      }

      return {
        success: true,
        token: response.token,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  }
}
