import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    
    // Address
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Emergency Contact (Optional)
    emergencyContactName: '',
    relationship: '',
    emergencyPhoneNumber: '',
    
    // Account Security
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation functions
  const validateRequired = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} is required`;
    return '';
  };

  const validateName = (value, fieldName) => {
    const required = validateRequired(value, fieldName);
    if (required) return required;
    
    if (value.length < 2) return `${fieldName} must be at least 2 characters`;
    if (value.length > 50) return `${fieldName} must be less than 50 characters`;
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    return '';
  };

  const validateEmail = (email) => {
    const required = validateRequired(email, 'Email');
    if (required) return required;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    const required = validateRequired(phone, 'Phone number');
    if (required) return required;
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) return 'Please enter a valid phone number';
    return '';
  };

  const validateDateOfBirth = (date) => {
    const required = validateRequired(date, 'Date of birth');
    if (required) return required;
    
    const selectedDate = new Date(date);
    const today = new Date();
    const minAge = 13;
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    
    if (selectedDate > today) return 'Date of birth cannot be in the future';
    if (selectedDate > maxDate) return `You must be at least ${minAge} years old to register`;
    return '';
  };

  const validateAddress = (value, fieldName, maxLength) => {
    const required = validateRequired(value, fieldName);
    if (required) return required;
    
    if (value.length > maxLength) return `${fieldName} must be less than ${maxLength} characters`;
    return '';
  };

  const validateZipCode = (zip) => {
    const required = validateRequired(zip, 'ZIP code');
    if (required) return required;
    
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zip)) return 'Please enter a valid ZIP code';
    return '';
  };

  const validatePassword = (password) => {
    const required = validateRequired(password, 'Password');
    if (required) return required;
    
    if (password.length < 8) return 'Password must be at least 8 characters long';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let strength = '';
    let error = '';
    
    if (password.length >= 8) {
      const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
      if (strengthScore === 4) strength = 'strong';
      else if (strengthScore >= 3) strength = 'good';
      else if (strengthScore >= 2) strength = 'fair';
      else strength = 'weak';
    }
    
    if (password.length >= 8 && strength === 'weak') {
      error = 'Password must include uppercase, lowercase, number, and special character';
    }
    
    setPasswordStrength(strength);
    return error;
  };

  const validateConfirmPassword = (confirmPassword) => {
    const required = validateRequired(confirmPassword, 'Confirm password');
    if (required) return required;
    
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  const validateEmergencyContact = () => {
    const errors = {};
    
    // If any emergency contact field is filled, validate all
    if (formData.emergencyContactName || formData.relationship || formData.emergencyPhoneNumber) {
      if (formData.emergencyContactName) {
        const nameError = validateName(formData.emergencyContactName, 'Emergency contact name');
        if (nameError) errors.emergencyContactName = nameError;
      }
      
      if (formData.emergencyPhoneNumber) {
        const phoneError = validatePhone(formData.emergencyPhoneNumber);
        if (phoneError) errors.emergencyPhoneNumber = phoneError;
      }
      
      // Check for duplicate contact info
      if (formData.emergencyContactName && 
          (formData.emergencyContactName.toLowerCase() === formData.firstName.toLowerCase() ||
           formData.emergencyContactName.toLowerCase() === formData.lastName.toLowerCase())) {
        errors.emergencyContactName = 'Emergency contact cannot be the same as patient';
      }
      
      if (formData.emergencyPhoneNumber && formData.emergencyPhoneNumber === formData.phoneNumber) {
        errors.emergencyPhoneNumber = 'Emergency contact phone cannot be the same as patient phone';
      }
    }
    
    return errors;
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    
    if (touched.firstName) {
      newErrors.firstName = validateName(formData.firstName, 'First name');
    }
    if (touched.lastName) {
      newErrors.lastName = validateName(formData.lastName, 'Last name');
    }
    if (touched.email) {
      newErrors.email = validateEmail(formData.email);
    }
    if (touched.phoneNumber) {
      newErrors.phoneNumber = validatePhone(formData.phoneNumber);
    }
    if (touched.dateOfBirth) {
      newErrors.dateOfBirth = validateDateOfBirth(formData.dateOfBirth);
    }
    if (touched.gender) {
      newErrors.gender = validateRequired(formData.gender, 'Gender');
    }
    if (touched.streetAddress) {
      newErrors.streetAddress = validateAddress(formData.streetAddress, 'Street address', 200);
    }
    if (touched.city) {
      newErrors.city = validateAddress(formData.city, 'City', 100);
    }
    if (touched.state) {
      newErrors.state = validateAddress(formData.state, 'State', 50);
    }
    if (touched.zipCode) {
      newErrors.zipCode = validateZipCode(formData.zipCode);
    }
    if (touched.password) {
      newErrors.password = validatePassword(formData.password);
    }
    if (touched.confirmPassword) {
      newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword);
    }
    
    // Emergency contact validation
    const emergencyErrors = validateEmergencyContact();
    Object.assign(newErrors, emergencyErrors);
    
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
    
    // Mark all required fields as touched
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'gender',
      'streetAddress', 'city', 'state', 'zipCode', 'password', 'confirmPassword'
    ];
    
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all required fields
    const validationErrors = {};
    requiredFields.forEach(field => {
      let error = '';
      switch (field) {
        case 'firstName':
          error = validateName(formData.firstName, 'First name');
          break;
        case 'lastName':
          error = validateName(formData.lastName, 'Last name');
          break;
        case 'email':
          error = validateEmail(formData.email);
          break;
        case 'phoneNumber':
          error = validatePhone(formData.phoneNumber);
          break;
        case 'dateOfBirth':
          error = validateDateOfBirth(formData.dateOfBirth);
          break;
        case 'gender':
          error = validateRequired(formData.gender, 'Gender');
          break;
        case 'streetAddress':
          error = validateAddress(formData.streetAddress, 'Street address', 200);
          break;
        case 'city':
          error = validateAddress(formData.city, 'City', 100);
          break;
        case 'state':
          error = validateAddress(formData.state, 'State', 50);
          break;
        case 'zipCode':
          error = validateZipCode(formData.zipCode);
          break;
        case 'password':
          error = validatePassword(formData.password);
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(formData.confirmPassword);
          break;
      }
      if (error) validationErrors[field] = error;
    });

    // Emergency contact validation
    const emergencyErrors = validateEmergencyContact();
    Object.assign(validationErrors, emergencyErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Patient registration successful:', formData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({
        submit: 'Registration failed. Please try again or contact support.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'weak': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'strong': return 'Strong password';
      case 'good': return 'Good password';
      case 'fair': return 'Fair password';
      case 'weak': return 'Weak password';
      default: return '';
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to HealthFirst!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. We've sent a verification email to{' '}
            <span className="font-medium">{formData.email}</span>
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email and click the verification link</li>
              <li>• Complete your profile setup</li>
              <li>• Schedule your first appointment</li>
            </ul>
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/patient');
              window.location.reload();
            }}
            className="w-full bg-healthcare-600 text-white py-3 px-4 rounded-md font-medium hover:bg-healthcare-700 transition-colors"
          >
            Go to Patient Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-healthcare-50 to-blue-50 overflow-hidden">
      <div className="h-full container mx-auto px-4 py-4">
        <div className="h-full max-w-7xl mx-auto">
          <div className="h-full grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Section - Welcome and Information */}
            <div className="hidden lg:flex flex-col justify-center items-center text-center">
              <div className="max-w-md">
                <div className="mx-auto h-20 w-20 bg-healthcare-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Join Our Care Network
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Create your patient account to access your health records, schedule appointments, and stay connected with your healthcare team.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">Secure health record access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">Easy appointment scheduling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <span className="text-gray-700">Direct communication with providers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Registration Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full overflow-y-auto">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Patient Registration
                </h1>
                <p className="text-gray-600">
                  Complete the form below to create your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                        disabled={isLoading}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                        disabled={isLoading}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                      disabled={isLoading}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date of Birth *
                      </label>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.gender ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Address
                  </h3>
                  
                  <div>
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                      Street Address *
                    </label>
                    <input
                      id="streetAddress"
                      name="streetAddress"
                      type="text"
                      required
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                        errors.streetAddress ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your street address"
                      disabled={isLoading}
                    />
                    {errors.streetAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.city ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="City"
                        disabled={isLoading}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State *
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.state ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="State"
                        disabled={isLoading}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP Code *
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.zipCode ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="ZIP Code"
                        disabled={isLoading}
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Emergency Contact (Optional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                        Emergency Contact Name
                      </label>
                      <input
                        id="emergencyContactName"
                        name="emergencyContactName"
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Emergency contact name"
                        disabled={isLoading}
                      />
                      {errors.emergencyContactName && (
                        <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                        Relationship
                      </label>
                      <input
                        id="relationship"
                        name="relationship"
                        type="text"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.relationship ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Spouse, Parent"
                        disabled={isLoading}
                      />
                      {errors.relationship && (
                        <p className="mt-1 text-sm text-red-600">{errors.relationship}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="emergencyPhoneNumber" className="block text-sm font-medium text-gray-700">
                      Emergency Phone Number
                    </label>
                    <input
                      id="emergencyPhoneNumber"
                      name="emergencyPhoneNumber"
                      type="tel"
                      value={formData.emergencyPhoneNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                        errors.emergencyPhoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Emergency contact phone"
                      disabled={isLoading}
                    />
                    {errors.emergencyPhoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyPhoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Account Security Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Account Security
                  </h3>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Create a strong password"
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
                    {formData.password && passwordStrength && (
                      <p className={`mt-1 text-sm ${getPasswordStrengthColor()}`}>
                        {getPasswordStrengthText()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-healthcare-500 focus:border-healthcare-500 sm:text-sm ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {errors.submit}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-healthcare-600 hover:bg-healthcare-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthcare-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      window.history.pushState({}, '', '/patient');
                      window.location.reload();
                    }}
                    className="text-healthcare-700 hover:text-healthcare-800 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration; 