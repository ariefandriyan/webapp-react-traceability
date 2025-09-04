import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormController } from '../controllers/formController';
import { NavigationController } from '../controllers/navigationController';
import { LoginCredentials } from '../types/auth';
import { useDocumentTitle } from '../lib/useDocumentTitle';

// Theme management utilities
const getStoredTheme = (): 'light' | 'dark' | 'system' => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
};

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const systemTheme = getSystemTheme();
    root.className = systemTheme === 'dark' ? 'dark' : '';
  } else {
    root.className = theme === 'dark' ? 'dark' : '';
  }
};

const LoginPage: React.FC = () => {
  // Set document title
  useDocumentTitle('Login - Tobacco Traceability System');

  const navigate = useNavigate();
  const { login, loginWithGoogle, user, isLoading, error, clearError } = useAuth();
  
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize theme on component mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setCurrentTheme(storedTheme);
    applyTheme(storedTheme);
    
    // Set initial dark mode state
    const root = document.documentElement;
    setIsDarkMode(root.classList.contains('dark'));
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (currentTheme === 'system') {
        const systemTheme = getSystemTheme();
        const root = document.documentElement;
        root.className = systemTheme === 'dark' ? 'dark' : '';
        setIsDarkMode(systemTheme === 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [currentTheme]);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-200/50 dark:border-gray-700/50 hover:scale-110 group"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="relative">
          {isDarkMode ? (
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">☀️</span>
          ) : (
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">🌙</span>
          )}
        </div>
      </button>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Welcome */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center space-y-8 p-8">
          {/* Logo Section */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 rounded-3xl shadow-2xl dark:shadow-emerald-900/30 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <div className="text-white text-4xl font-bold">🌿</div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-300 dark:to-orange-400 rounded-full flex items-center justify-center shadow-lg dark:shadow-yellow-900/30">
              <span className="text-white text-sm">✓</span>
            </div>
          </div>

          {/* Brand Name */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
              Tobacco Traceability
            </h1>
            <p className="text-xl text-emerald-600 dark:text-emerald-400 font-semibold transition-colors duration-300">
              Universitas Brawijaya
            </p>
          </div>

          {/* Welcome Message */}
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
              Selamat Datang Kembali! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
              Sistem manajemen traceability tembakau untuk mendukung transparansi dan kualitas produksi tembakau di Indonesia.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 max-w-sm">
            {[
              { icon: '📊', title: 'Real-time Tracking', desc: 'Pantau aktivitas secara real-time' },
              { icon: '🔗', title: 'Supply Chain', desc: 'Transparansi rantai pasok' },
              { icon: '✅', title: 'Compliance', desc: 'Manajemen kepatuhan' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:bg-white/60 dark:hover:bg-gray-800/60">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white text-sm transition-colors duration-300">{feature.title}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs transition-colors duration-300">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 rounded-2xl shadow-xl dark:shadow-emerald-900/30 flex items-center justify-center transition-all duration-300">
              <span className="text-white text-2xl">🌿</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl dark:shadow-gray-900/50 border border-white/20 dark:border-gray-700/20 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Masuk ke Akun Anda</h2>
              <p className="text-emerald-100 dark:text-emerald-200 text-sm">Silakan masukkan kredensial Anda untuk mengakses platform</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📧 Email Address
                  </label>
                  <div className="relative">
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      autoComplete="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        formErrors.email 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500 hover:border-emerald-300'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Masukkan email Anda"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-400 text-lg">👤</span>
                    </div>
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <span>❌</span>
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🔒 Password
                  </label>
                  <div className="relative">
                    <input 
                      id="password" 
                      name="password" 
                      type="password" 
                      autoComplete="current-password" 
                      required 
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        formErrors.password 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-emerald-500 hover:border-emerald-300'
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                      placeholder="Masukkan password Anda"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-400 text-lg">🔑</span>
                    </div>
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <span>❌</span>
                      <span>{formErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      id="remember-me" 
                      name="rememberMe" 
                      type="checkbox" 
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 bg-white border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Ingat saya</span>
                  </label>
                  
                  <button 
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-200"
                  >
                    Lupa Password? 🤔
                  </button>
                </div>

                {/* Login Button */}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg dark:shadow-emerald-900/30 hover:shadow-xl dark:hover:shadow-emerald-900/40 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Masuk...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>Masuk ke Dashboard</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-600 transition-colors duration-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
                    atau lanjutkan dengan
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 dark:focus:ring-gray-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isLoading ? 'Masuk...' : 'Masuk dengan Google'}</span>
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600 transition-colors duration-300">
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Belum memiliki akun? 
                  <button 
                    type="button"
                    onClick={handleSignupClick}
                    className="ml-2 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors duration-200"
                  >
                    Daftar Sekarang 📝
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
              © 2025 Universitas Brawijaya. Sistem Traceability Tembakau.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">
              Versi 2.1.0 | Build 2025.09.05.001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
