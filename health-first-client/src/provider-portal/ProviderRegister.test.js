import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProviderRegister from './ProviderRegister';

// Mock the Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  EyeIcon: () => <div data-testid="eye-icon">Eye</div>,
  EyeSlashIcon: () => <div data-testid="eye-slash-icon">EyeSlash</div>,
  CheckCircleIcon: () => <div data-testid="check-circle-icon">CheckCircle</div>,
  ExclamationCircleIcon: () => <div data-testid="exclamation-circle-icon">ExclamationCircle</div>,
}));

describe('ProviderRegister Component', () => {
  beforeEach(() => {
    // Mock window.alert
    global.alert = jest.fn();
  });

  test('renders registration form with all required sections', () => {
    render(<ProviderRegister />);
    
    // Check for main elements
    expect(screen.getByText('Register as a Healthcare Provider')).toBeInTheDocument();
    expect(screen.getByText('Complete the form below to get started')).toBeInTheDocument();
    
    // Check for section headers
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Professional Information')).toBeInTheDocument();
    expect(screen.getByText('Clinic Address')).toBeInTheDocument();
    expect(screen.getByText('Account Security')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/specialization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/medical license number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/years of experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    render(<ProviderRegister />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/specialization is required/i)).toBeInTheDocument();
      expect(screen.getByText(/medical license number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/years of experience is required/i)).toBeInTheDocument();
      expect(screen.getByText(/street address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      expect(screen.getByText(/state is required/i)).toBeInTheDocument();
      expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    render(<ProviderRegister />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid phone number', async () => {
    render(<ProviderRegister />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    fireEvent.blur(phoneInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid license number', async () => {
    render(<ProviderRegister />);
    
    const licenseInput = screen.getByLabelText(/medical license number/i);
    fireEvent.change(licenseInput, { target: { value: 'LIC-123@' } });
    fireEvent.blur(licenseInput);
    
    await waitFor(() => {
      expect(screen.getByText(/license number must contain only letters and numbers/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid years of experience', async () => {
    render(<ProviderRegister />);
    
    const experienceInput = screen.getByLabelText(/years of experience/i);
    fireEvent.change(experienceInput, { target: { value: '60' } });
    fireEvent.blur(experienceInput);
    
    await waitFor(() => {
      expect(screen.getByText(/years of experience must be between 0 and 50/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid ZIP code', async () => {
    render(<ProviderRegister />);
    
    const zipInput = screen.getByLabelText(/zip code/i);
    fireEvent.change(zipInput, { target: { value: 'invalid-zip' } });
    fireEvent.blur(zipInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid zip code/i)).toBeInTheDocument();
    });
  });

  test('shows password strength indicator', async () => {
    render(<ProviderRegister />);
    
    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    await waitFor(() => {
      expect(screen.getByText(/weak/i)).toBeInTheDocument();
    });
  });

  test('shows password strength feedback', async () => {
    render(<ProviderRegister />);
    
    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'weakpassword' } });
    
    await waitFor(() => {
      expect(screen.getByText(/include uppercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/include number/i)).toBeInTheDocument();
      expect(screen.getByText(/include special character/i)).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    render(<ProviderRegister />);
    
    const passwordInput = screen.getByTestId('password-input');
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

  test('toggles confirm password visibility', () => {
    render(<ProviderRegister />);
    
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const toggleButton = confirmPasswordInput.parentElement.querySelector('button');
    
    // Password should be hidden by default
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    fireEvent.click(toggleButton);
    
    // Password should be visible
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    
    // Click toggle button again
    fireEvent.click(toggleButton);
    
    // Password should be hidden again
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('shows validation error when passwords do not match', async () => {
    render(<ProviderRegister />);
    
    const passwordInput = screen.getByTestId('password-input');
    const confirmPasswordInput = screen.getByTestId('confirm-password-input');
    
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123!' } });
    fireEvent.blur(confirmPasswordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('handles form submission with valid data', async () => {
    render(<ProviderRegister />);
    
    // Fill in all required fields with valid data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/specialization/i), { target: { value: 'Cardiology' } });
    fireEvent.change(screen.getByLabelText(/medical license number/i), { target: { value: 'LIC123456' } });
    fireEvent.change(screen.getByLabelText(/years of experience/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'NY' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Should show loading state
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('shows length validation errors', async () => {
    render(<ProviderRegister />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'A' } });
    fireEvent.blur(firstNameInput);
    
    await waitFor(() => {
      expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  test('renders marketing content on desktop', () => {
    render(<ProviderRegister />);
    
    // Check for marketing content
    expect(screen.getByText('Join Our Trusted Network of Providers')).toBeInTheDocument();
    expect(screen.getByText(/connect with patients/i)).toBeInTheDocument();
    expect(screen.getByText(/10,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/active providers/i)).toBeInTheDocument();
    expect(screen.getByText(/99\.9%/i)).toBeInTheDocument();
    expect(screen.getByText(/uptime/i)).toBeInTheDocument();
    expect(screen.getByText(/hipaa compliant/i)).toBeInTheDocument();
  });
}); 