import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PatientLogin from './PatientLogin';

describe('PatientLogin', () => {
  test('renders patient login form', () => {
    render(<PatientLogin />);
    
    expect(screen.getByText('Patient Sign In')).toBeInTheDocument();
    expect(screen.getByText('Access your health records and appointments')).toBeInTheDocument();
    expect(screen.getByLabelText(/email or phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(<PatientLogin />);
    
    const emailInput = screen.getByLabelText(/email or phone number/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address or phone number/i)).toBeInTheDocument();
    });
  });

  test('validates valid email format', async () => {
    render(<PatientLogin />);
    
    const emailInput = screen.getByLabelText(/email or phone number/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Valid email format')).toBeInTheDocument();
    });
  });

  test('validates password length', async () => {
    render(<PatientLogin />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    render(<PatientLogin />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: '' });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('handles form submission', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<PatientLogin />);
    
    const emailInput = screen.getByLabelText(/email or phone number/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Welcome back! Redirecting to your patient dashboard...');
    });
    
    alertMock.mockRestore();
  });

  test('shows forgot password alert', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<PatientLogin />);
    
    const forgotPasswordButton = screen.getByText('Forgot password?');
    fireEvent.click(forgotPasswordButton);
    
    expect(alertMock).toHaveBeenCalledWith('Forgot password functionality would open here');
    
    alertMock.mockRestore();
  });

  test('shows create account alert', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<PatientLogin />);
    
    const createAccountButton = screen.getByText('Create an account');
    fireEvent.click(createAccountButton);
    
    expect(alertMock).toHaveBeenCalledWith('Navigate to patient registration page');
    
    alertMock.mockRestore();
  });
}); 