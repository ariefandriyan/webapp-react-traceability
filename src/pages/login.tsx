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
  
  const [formData, setFormData] = useState<LoginCredentials & { username?: string }>({
    email: '',
    password: '',
    rememberMe: false,
    username: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

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

  const handleForgotPasswordClick = () => {
    alert('Silakan hubungi administrator untuk reset password');
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
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Desktop Background */}
        <div className="hidden md:block absolute inset-0">
          <img 
            src="/bg_image.PNG" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>
        
        {/* Mobile Background */}
        <div className="block md:hidden absolute inset-0">
          <img 
            src="/bg_image_portrait.PNG" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-white/20 dark:border-gray-700/30 hover:scale-110 group"
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        
        {/* Left Side - Branding & Welcome (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start px-12 xl:px-20 text-white">
          {/* Main Logo */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 mb-6">
              <img 
                src="/app_logo.PNG" 
                alt="MENTAS Logo" 
                className="h-64 w-auto mx-auto"
              />
            </div>
            {/* <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              MENTAS
            </h1>
            <p className="text-xl text-white/90 font-medium drop-shadow-md">
              Monitoring Potensi Panen Tembakau Nasional
            </p> */}
          </div>

          {/* Welcome Message */}
          <div className="mb-8 max-w-lg">
            <h2 className="text-3xl font-semibold mb-4 drop-shadow-md">
              Selamat Datang! 👋
            </h2>
            <p className="text-lg text-white/90 leading-relaxed drop-shadow-sm">
              Platform digital untuk monitoring dan prediksi hasil panen tembakau yang mendukung transparansi dan kualitas produksi tembakau di Indonesia.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mb-12">
            {[
              { icon: '📊', title: 'Real-time Monitoring', desc: 'Pantau kondisi tanaman secara real-time' },
              { icon: '�', title: 'Prediksi Panen', desc: 'Prediksi waktu dan kapasitas panen dengan akurat' },
              { icon: '📈', title: 'Analytics Dashboard', desc: 'Analisis data untuk optimasi produksi' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <div className="font-semibold text-white text-base drop-shadow-sm">{feature.title}</div>
                  <div className="text-white/80 text-sm drop-shadow-sm">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Support Logos */}
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-2xl shadow-2xl border border-white/20 mb-6">
            <div className="flex items-center space-x-6">
              <span className="text-white/80 text-sm font-medium drop-shadow-sm">Didukung oleh:</span>
              <img 
                src="/ktng_logo.PNG" 
                alt="KTNG Logo" 
                className="h-14 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <img 
                src="/support_logo.PNG" 
                alt="Support Logo" 
                className="h-14 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            
            {/* Mobile Logo (Tablet and below) */}
            <div className="lg:hidden text-center mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20 mb-4 inline-block">
                <img 
                  src="/app_logo.PNG" 
                  alt="MENTAS Logo" 
                  className="h-20 w-auto"
                />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                MENTAS
              </h1>
              <p className="text-white/90 text-sm drop-shadow-md">
                Monitoring Potensi Panen Tembakau Nasional
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 transition-all duration-300">
              
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 transition-colors duration-300">
                  Masuk ke Akun
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Silakan masukkan kredensial Anda untuk melanjutkan
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Username atau Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 dark:text-gray-500 text-lg">👤</span>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Masukkan username atau email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 dark:text-gray-500 text-lg">🔒</span>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Masukkan password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                    >
                      <span className="text-lg">{showPassword ? '🙈' : '👁️'}</span>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-2 transition-colors duration-300"
                    />
                    <span className="group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                      Ingat saya
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300"
                  >
                    Lupa password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Masuk</span>
                      <span className="text-lg">→</span>
                    </div>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      atau masuk dengan
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {isLoading ? 'Masuk...' : 'Masuk dengan Google'}
                    </span>
                  </button>
                </div>

              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Belum punya akun?{' '}
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300">
                    Hubungi Administrator
                  </button>
                </p>
              </div>

            </div>

            {/* Mobile Support Logos */}
            <div className="lg:hidden mt-8 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <span className="text-white/80 text-sm font-medium drop-shadow-sm">Didukung oleh:</span>
              </div>
              <div className="flex items-center justify-center space-x-6">
                <img 
                  src="/ktng_logo.PNG" 
                  alt="KTNG Logo" 
                  className="h-12 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="/support_logo.PNG" 
                  alt="Support Logo" 
                  className="h-12 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
