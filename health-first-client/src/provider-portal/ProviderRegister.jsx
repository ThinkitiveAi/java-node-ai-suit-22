import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ProviderRegister = () => {
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: null,
    
    // Professional Information
    specialization: '',
    licenseNumber: '',
    yearsExperience: '',
    
    // Clinic Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Account Security
    password: '',
    confirmPassword: ''
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [profilePreview, setProfilePreview] = useState(null);

  // Validation state
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    specialization: false,
    licenseNumber: false,
    yearsExperience: false,
    streetAddress: false,
    city: false,
    state: false,
    zipCode: false,
    password: false,
    confirmPassword: false
  });

  // Validation functions
  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  };

  const validateLength = (value, fieldName, min, max) => {
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    if (max && value.length > max) {
      return `${fieldName} must be no more than ${max} characters`;
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return ''; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const validateLicenseNumber = (license) => {
    if (!license) return ''; // License is optional
    const licenseRegex = /^[a-zA-Z0-9]+$/;
    if (!licenseRegex.test(license)) {
      return 'License number must contain only letters and numbers';
    }
    return '';
  };

  const validateYearsExperience = (years) => {
    if (!years) return ''; // Years of experience is optional
    const num = parseInt(years);
    if (isNaN(num) || num < 0 || num > 50) {
      return 'Years of experience must be between 0 and 50';
    }
    return '';
  };

  const validateZipCode = (zip) => {
    if (!zip) return ''; // ZIP code is optional
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zip)) {
      return 'Please enter a valid ZIP code';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const feedback = [];
    if (!hasUpperCase) feedback.push('Include uppercase letter');
    if (!hasLowerCase) feedback.push('Include lowercase letter');
    if (!hasNumbers) feedback.push('Include number');
    if (!hasSpecialChar) feedback.push('Include special character');
    
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    setPasswordStrength({ score, feedback });
    
    if (score < 3) {
      return 'Password must meet strength requirements';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        let error = '';
        
        switch (field) {
          case 'firstName':
            error = validateRequired(formData[field], 'First name') || 
                   validateLength(formData[field], 'First name', 2, 50);
            break;
          case 'lastName':
            error = validateRequired(formData[field], 'Last name') || 
                   validateLength(formData[field], 'Last name', 2, 50);
            break;
          case 'email':
            error = validateEmail(formData[field]);
            break;
          case 'phone':
            error = validatePhone(formData[field]);
            break;
          case 'specialization':
            error = validateRequired(formData[field], 'Specialization') || 
                   validateLength(formData[field], 'Specialization', 3, 100);
            break;
          case 'licenseNumber':
            error = validateLicenseNumber(formData[field]);
            break;
          case 'yearsExperience':
            error = validateYearsExperience(formData[field]);
            break;
          case 'streetAddress':
            error = validateRequired(formData[field], 'Street address') || 
                   validateLength(formData[field], 'Street address', 1, 200);
            break;
          case 'city':
            error = validateRequired(formData[field], 'City') || 
                   validateLength(formData[field], 'City', 1, 100);
            break;
          case 'state':
            error = validateRequired(formData[field], 'State') || 
                   validateLength(formData[field], 'State', 1, 50);
            break;
          case 'zipCode':
            error = validateZipCode(formData[field]);
            break;
          case 'password':
            error = validatePassword(formData[field]);
            break;
          case 'confirmPassword':
            error = validateConfirmPassword(formData[field]);
            break;
          default:
            break;
        }
        
        if (error) newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
  }, [formData, touched]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched for validation
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (PNG, JPG, JPEG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to trigger validation
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    
    // Personal Information (Required fields only)
    newErrors.firstName = validateRequired(formData.firstName, 'First name') || 
                         validateLength(formData.firstName, 'First name', 2, 50);
    newErrors.lastName = validateRequired(formData.lastName, 'Last name') || 
                        validateLength(formData.lastName, 'Last name', 2, 50);
    newErrors.email = validateEmail(formData.email);
    
    // Optional fields validation
    newErrors.phone = validatePhone(formData.phone);
    newErrors.specialization = formData.specialization ? 
                              validateLength(formData.specialization, 'Specialization', 3, 100) : '';
    newErrors.licenseNumber = validateLicenseNumber(formData.licenseNumber);
    newErrors.yearsExperience = validateYearsExperience(formData.yearsExperience);
    newErrors.streetAddress = formData.streetAddress ? 
                             validateLength(formData.streetAddress, 'Street address', 1, 200) : '';
    newErrors.city = formData.city ? 
                    validateLength(formData.city, 'City', 1, 100) : '';
    newErrors.state = formData.state ? 
                     validateLength(formData.state, 'State', 1, 50) : '';
    newErrors.zipCode = validateZipCode(formData.zipCode);
    
    // Account Security (Required)
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword);
    
    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful registration
      setSuccess(true);
      
      // Redirect to login after success
      setTimeout(() => {
        alert('Registration successful! Redirecting to login...');
        // In a real app, you would redirect to login or dashboard
      }, 2000);
      
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'text-red-500';
      case 2:
        return 'text-yellow-500';
      case 3:
        return 'text-blue-500';
      case 4:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-healthcare-50 to-blue-50 overflow-hidden">
      <div className="h-full container mx-auto px-4 py-4">
        <div className="h-full max-w-7xl mx-auto">
          <div className="h-full grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Section - Doctor Image and Marketing */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="mb-8">
                  <div className="w-64 h-64 mx-auto bg-gradient-to-br from-healthcare-100 to-healthcare-200 rounded-2xl flex items-center justify-center">
                    <svg className="w-32 h-32 text-healthcare-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Join Our Trusted Network of Providers
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Connect with patients, manage your practice, and grow your healthcare business with our comprehensive platform.
                </p>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-healthcare-600 mb-2">10,000+</div>
                    <div className="text-sm text-gray-600">Active Providers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-healthcare-600 mb-2">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
                
                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>HIPAA Compliant • Secure & Encrypted</span>
                </div>
              </div>
            </div>

            {/* Right Section - Registration Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full overflow-y-auto hide-scrollbar">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Register as a Healthcare Provider
                </h1>
                <p className="text-gray-600">
                  Complete the form below to get started
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Profile Picture Upload */}
                <div className="text-center">
                  <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                          {profilePreview ? (
                            <img 
                              src={profilePreview} 
                              alt="Profile preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <label 
                          htmlFor="profilePicture" 
                          className="absolute bottom-0 right-0 bg-healthcare-600 text-white rounded-full p-2 cursor-pointer hover:bg-healthcare-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </label>
                      </div>
                    </div>
                    <input
                      id="profilePicture"
                      name="profilePicture"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                </div>
                
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-healthcare-600 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        className={`input-field ${errors.firstName ? 'input-error' : ''}`}
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        className={`input-field ${errors.lastName ? 'input-error' : ''}`}
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={`input-field ${errors.email ? 'input-error' : ''}`}
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className={`input-field ${errors.phone ? 'input-error' : ''}`}
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.phone && <p className="error-message">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-healthcare-600 mr-2" />
                    Professional Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <input
                        id="specialization"
                        name="specialization"
                        type="text"
                        className={`input-field ${errors.specialization ? 'input-error' : ''}`}
                        placeholder="e.g., Cardiology, Pediatrics"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.specialization && <p className="error-message">{errors.specialization}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Medical License Number
                      </label>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        className={`input-field ${errors.licenseNumber ? 'input-error' : ''}`}
                        placeholder="Enter your license number"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.licenseNumber && <p className="error-message">{errors.licenseNumber}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        id="yearsExperience"
                        name="yearsExperience"
                        type="number"
                        min="0"
                        max="50"
                        className={`input-field ${errors.yearsExperience ? 'input-error' : ''}`}
                        placeholder="Enter years of experience"
                        value={formData.yearsExperience}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.yearsExperience && <p className="error-message">{errors.yearsExperience}</p>}
                    </div>
                  </div>
                </div>

                {/* Clinic Address Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-healthcare-600 mr-2" />
                    Clinic Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        id="streetAddress"
                        name="streetAddress"
                        type="text"
                        className={`input-field ${errors.streetAddress ? 'input-error' : ''}`}
                        placeholder="Enter your street address"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {errors.streetAddress && <p className="error-message">{errors.streetAddress}</p>}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          className={`input-field ${errors.city ? 'input-error' : ''}`}
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        {errors.city && <p className="error-message">{errors.city}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          className={`input-field ${errors.state ? 'input-error' : ''}`}
                          placeholder="Enter state"
                          value={formData.state}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        {errors.state && <p className="error-message">{errors.state}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          className={`input-field ${errors.zipCode ? 'input-error' : ''}`}
                          placeholder="Enter ZIP code"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        {errors.zipCode && <p className="error-message">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Security Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-healthcare-600 mr-2" />
                    Account Security
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className={`input-field pr-12 ${errors.password ? 'input-error' : ''}`}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          data-testid="password-input"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {errors.password && <p className="error-message">{errors.password}</p>}
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-2 w-8 rounded ${
                                    passwordStrength.score >= level
                                      ? getPasswordStrengthColor().replace('text-', 'bg-')
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-sm ${getPasswordStrengthColor()}`}>
                              {passwordStrength.score === 0 && 'Very Weak'}
                              {passwordStrength.score === 1 && 'Weak'}
                              {passwordStrength.score === 2 && 'Fair'}
                              {passwordStrength.score === 3 && 'Good'}
                              {passwordStrength.score === 4 && 'Strong'}
                            </span>
                          </div>
                          {passwordStrength.feedback.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              {passwordStrength.feedback.map((feedback, index) => (
                                <div key={index} className="flex items-center space-x-1">
                                  <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />
                                  <span>{feedback}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`input-field pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          data-testid="confirm-password-input"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="error-message">{errors.general}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="success-message">Registration successful! Redirecting to login...</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary w-full flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        window.history.pushState({}, '', '/login');
                        window.location.reload();
                      }}
                      className="text-healthcare-700 hover:text-healthcare-800 font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegister; 