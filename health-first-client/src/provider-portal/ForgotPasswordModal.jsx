import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('method'); // 'method', 'email', 'otp'
  const [method, setMethod] = useState(''); // 'phone' or 'email'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMethodSelect = (selectedMethod) => {
    setMethod(selectedMethod);
    setStep('email');
    setError('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep('otp');
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Password reset link has been sent to your email!');
      onClose();
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('method');
    setMethod('');
    setEmail('');
    setOtp('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600">
            {step === 'method' && 'Choose how you want to reset your password'}
            {step === 'email' && `Enter your email to receive OTP via ${method}`}
            {step === 'otp' && `Enter the 6-digit OTP sent to your ${method}`}
          </p>
        </div>

        {/* Method Selection */}
        {step === 'method' && (
          <div className="space-y-4">
            <button
              onClick={() => handleMethodSelect('phone')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-healthcare-500 hover:bg-healthcare-50 transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-healthcare-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-healthcare-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-sm text-gray-600">Receive OTP via SMS</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMethodSelect('email')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-healthcare-500 hover:bg-healthcare-50 transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-healthcare-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-healthcare-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-sm text-gray-600">Receive OTP via email</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Email Input */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email address"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        )}

        {/* OTP Input */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter the 6-digit code sent to your {method}
              </p>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        )}

        {/* Back button for email and OTP steps */}
        {(step === 'email' || step === 'otp') && (
          <button
            onClick={() => {
              if (step === 'otp') {
                setStep('email');
                setOtp('');
              } else {
                setStep('method');
                setEmail('');
              }
              setError('');
            }}
            className="w-full mt-4 text-healthcare-600 hover:text-healthcare-700 font-medium"
          >
            ← Go Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal; 