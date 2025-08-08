import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProviderLogin from './Login';

// Mock the Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  EyeIcon: () => <div data-testid="eye-icon">Eye</div>,
  EyeSlashIcon: () => <div data-testid="eye-slash-icon">EyeSlash</div>,
}));

describe('ProviderLogin Component', () => {
  beforeEach(() => {
    // Mock window.alert
    global.alert = jest.fn();
  });

  test('renders login form with all required fields', () => {
    render(<ProviderLogin />);
    
    // Check for main elements
    expect(screen.getByText('Provider Login')).toBeInTheDocument();
    expect(screen.getByText('Access your healthcare dashboard securely')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors for invalid email', async () => {
    render(<ProviderLogin />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    
    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for short password', async () => {
    render(<ProviderLogin />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Enter short password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    render(<ProviderLogin />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = passwordInput.parentElement.querySelector('button');
    
    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    fireEvent.click(toggleButton);
    
    // Password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle button again
    fireEvent.click(toggleButton);
    
    // Password should be hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('handles form submission with valid data', async () => {
    render(<ProviderLogin />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Should show loading state
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('handles forgot password click', () => {
    render(<ProviderLogin />);
    
    const forgotPasswordButton = screen.getByText(/forgot password/i);
    
    fireEvent.click(forgotPasswordButton);
    
    expect(global.alert).toHaveBeenCalledWith('Forgot password functionality would be implemented here.');
  });

  test('toggles remember me checkbox', () => {
    render(<ProviderLogin />);
    
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    
    // Should be unchecked by default
    expect(rememberMeCheckbox).not.toBeChecked();
    
    // Click checkbox
    fireEvent.click(rememberMeCheckbox);
    
    // Should be checked
    expect(rememberMeCheckbox).toBeChecked();
    
    // Click again
    fireEvent.click(rememberMeCheckbox);
    
    // Should be unchecked
    expect(rememberMeCheckbox).not.toBeChecked();
  });
}); 