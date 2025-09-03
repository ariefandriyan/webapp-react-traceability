import { NavigateFunction } from 'react-router-dom';

export class NavigationController {
  /**
   * Handle login success navigation
   */
  static handleLoginSuccess(navigate: NavigateFunction, redirectPath?: string): void {
    const targetPath = redirectPath || '/dashboard';
    navigate(targetPath, { replace: true });
  }

  /**
   * Handle logout navigation
   */
  static handleLogout(navigate: NavigateFunction): void {
    navigate('/login', { replace: true });
  }

  /**
   * Handle unauthorized access
   */
  static handleUnauthorized(navigate: NavigateFunction): void {
    navigate('/login', { 
      replace: true,
      state: { message: 'Please log in to access this page' }
    });
  }

  /**
   * Handle forgotten password navigation
   */
  static handleForgotPassword(navigate: NavigateFunction): void {
    navigate('/forgot-password');
  }

  /**
   * Handle signup navigation
   */
  static handleSignup(navigate: NavigateFunction): void {
    navigate('/signup');
  }

  /**
   * Navigate to dashboard with specific section
   */
  static navigateToDashboard(
    navigate: NavigateFunction, 
    section?: string
  ): void {
    const path = section ? `/dashboard/${section}` : '/dashboard';
    navigate(path);
  }

  /**
   * Navigate back with fallback
   */
  static navigateBack(
    navigate: NavigateFunction, 
    fallbackPath: string = '/dashboard'
  ): void {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  }

  /**
   * Check if user should be redirected after login
   */
  static getRedirectPath(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    // Validate redirect path to prevent open redirect attacks
    if (redirectPath && this.isValidRedirectPath(redirectPath)) {
      return redirectPath;
    }
    
    return null;
  }

  /**
   * Validate redirect path for security
   */
  private static isValidRedirectPath(path: string): boolean {
    // Only allow relative paths that start with /
    // Prevent external URLs and potential XSS
    return path.startsWith('/') && !path.startsWith('//') && !path.includes('javascript:');
  }

  /**
   * Set redirect path in URL params
   */
  static setRedirectPath(path: string): void {
    if (this.isValidRedirectPath(path)) {
      const url = new URL(window.location.href);
      url.searchParams.set('redirect', path);
      window.history.replaceState({}, '', url.toString());
    }
  }

  /**
   * Clear redirect path from URL
   */
  static clearRedirectPath(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('redirect');
    window.history.replaceState({}, '', url.toString());
  }
}
