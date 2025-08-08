import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const PatientLogin = () => {
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifierType, setIdentifierType] = useState(''); // 'email' or 'phone'

  // Validation functions
  const validateLoginIdentifier = (identifier) => {
    if (!identifier) return 'Login identifier is required';
    
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
      setIdentifierType('email');
      return '';
    }
    
    // Check if it's a phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (phoneRegex.test(identifier.replace(/[\s\-\(\)]/g, ''))) {
      setIdentifierType('phone');
      return '';
    }
    
    setIdentifierType('');
    return 'Please enter a valid email address or phone number';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    if (touched.loginIdentifier) {
      newErrors.loginIdentifier = validateLoginIdentifier(formData.loginIdentifier);
    }
    if (touched.password) {
      newErrors.password = validatePassword(formData.password);
    }
    setErrors(newErrors);
  }, [formData, touched]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      loginIdentifier: true,
      password: true
    });

    // Validate all fields
    const identifierError = validateLoginIdentifier(formData.loginIdentifier);
    const passwordError = validatePassword(formData.password);

    if (identifierError || passwordError) {
      setErrors({
        loginIdentifier: identifierError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Patient login successful:', formData);
      // Here you would typically redirect to patient dashboard
      alert(`Welcome back! Redirecting to your patient dashboard...`);
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        submit: 'Invalid credentials. Please check your login information and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Here you would typically open a forgot password modal or navigate to reset page
    alert('Forgot password functionality would open here');
  };

  const getIdentifierPlaceholder = () => {
    if (identifierType === 'email') {
      return 'Enter your email address';
    } else if (identifierType === 'phone') {
      return 'Enter your phone number';
    }
    return 'Enter your email or phone number';
  };

  const getIdentifierLabel = () => {
    if (identifierType === 'email') {
      return 'Email Address';
    } else if (identifierType === 'phone') {
      return 'Phone Number';
    }
    return 'Email or Phone Number';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-healthcare-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Patient Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your health records and appointments
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Login Identifier Field */}
            <div>
              <label htmlFor="loginIdentifier" className="block text-sm font-medium text-gray-700">
                {getIdentifierLabel()}
              </label>
              <input
                id="loginIdentifier"
                name="loginIdentifier"
                type="text"
                autoComplete="username"
                required
                value={formData.loginIdentifier}
                onChange={handleInputChange}
                onBlur={() => setTouched(prev => ({ ...prev, loginIdentifier: true }))}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                  errors.loginIdentifier ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={getIdentifierPlaceholder()}
                disabled={isLoading}
              />
              {errors.loginIdentifier && (
                <p className="mt-1 text-sm text-red-600">{errors.loginIdentifier}</p>
              )}
              {!errors.loginIdentifier && identifierType && (
                <p className="mt-1 text-xs text-gray-500">
                  {identifierType === 'email' ? '✓ Valid email format' : '✓ Valid phone format'}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-healthcare-600 hover:text-healthcare-500"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.submit}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Need help? Contact our support team or try resetting your password.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-healthcare-600 hover:bg-healthcare-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthcare-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Terms and Register Link */}
        <div className="mt-6 text-center space-y-4">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-healthcare-600 hover:text-healthcare-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-healthcare-600 hover:text-healthcare-500">
              Privacy Policy
            </a>
          </p>
          
          {/* Register Link */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              New patient?{' '}
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/patient/register');
                  window.location.reload();
                }}
                className="text-healthcare-600 hover:text-healthcare-700 font-medium"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Need help? Contact support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin; 