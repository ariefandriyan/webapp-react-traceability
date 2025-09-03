import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormController } from '../controllers/formController';
import { NavigationController } from '../controllers/navigationController';
import { LoginCredentials } from '../types/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, user, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = NavigationController.getRedirectPath();
      NavigationController.handleLoginSuccess(navigate, redirectPath || undefined);
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Use FormController to handle field changes
    FormController.handleFieldChange(
      name as keyof LoginCredentials,
      newValue,
      formData,
      setFormData
    );

    // Clear field-specific errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validate form using FormController
    const validation = FormController.validateLoginForm(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    const result = await login(formData);
    
    if (result.success) {
      NavigationController.clearRedirectPath();
      const redirectPath = NavigationController.getRedirectPath();
      NavigationController.handleLoginSuccess(navigate, redirectPath || undefined);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    const result = await loginWithGoogle();
    
    if (result.success) {
      NavigationController.clearRedirectPath();
      const redirectPath = NavigationController.getRedirectPath();
      NavigationController.handleLoginSuccess(navigate, redirectPath || undefined);
    }
  };

  const handleSignupClick = () => {
    NavigationController.handleSignup(navigate);
  };

  const handleForgotPasswordClick = () => {
    NavigationController.handleForgotPassword(navigate);
  };
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to UB Tobacco Traceability</h1>
            <p className="text-xl mb-8 text-emerald-100">
              Track and manage your tobacco supply chain with confidence and transparency.
            </p>
            <div className="space-y-4 text-left max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Real-time tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Supply chain transparency</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Compliance management</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white bg-opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white bg-opacity-10 rounded-full translate-y-16 -translate-x-16"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your credentials to access the platform</p>
          </div>
          
          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-emerald-500'
                  }`}
                  placeholder="Enter your email"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-emerald-500'
                  }`}
                  placeholder="Enter your password"
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="rememberMe" 
                  type="checkbox" 
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <button 
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
              <div className="border-t border-gray-300 flex-grow mr-3"></div>
              <span className="text-sm text-gray-600">or continue with</span>
              <div className="border-t border-gray-300 flex-grow ml-3"></div>
            </div>
            
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                <g>
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.23 8.32 3.25l6.18-6.18C34.36 3.13 29.64 1 24 1 14.61 1 6.44 7.36 2.88 16.09l7.19 5.59C12.09 15.36 17.56 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.09 24.59c0-1.64-.15-3.22-.43-4.74H24v9.01h12.44c-.54 2.91-2.18 5.38-4.64 7.04l7.19 5.59C43.56 37.36 46.09 31.36 46.09 24.59z"/>
                  <path fill="#FBBC05" d="M10.07 28.68c-.54-1.62-.85-3.34-.85-5.18s.31-3.56.85-5.18l-7.19-5.59C2.44 16.64 1 20.13 1 24s1.44 7.36 3.88 10.09l7.19-5.59z"/>
                  <path fill="#EA4335" d="M24 46c5.64 0 10.36-1.87 13.81-5.09l-7.19-5.59c-2.01 1.35-4.59 2.15-7.62 2.15-6.44 0-11.91-5.86-13.93-13.18l-7.19 5.59C6.44 40.64 14.61 46 24 46z"/>
                  <path fill="none" d="M1 1h46v46H1z"/>
                </g>
              </svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
            
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">Don't have an account?</span>
              <button 
                type="button"
                onClick={handleSignupClick}
                className="ml-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
