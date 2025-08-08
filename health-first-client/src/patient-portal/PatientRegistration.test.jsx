import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PatientRegistration from './PatientRegistration';

describe('PatientRegistration', () => {
  test('renders patient registration form', () => {
    render(<PatientRegistration />);
    
    expect(screen.getByText('Patient Registration')).toBeInTheDocument();
    expect(screen.getByText('Complete the form below to create your account')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Emergency Contact (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Account Security')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(<PatientRegistration />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      expect(screen.getByText('Gender is required')).toBeInTheDocument();
    });
  });

  test('validates name format', async () => {
    render(<PatientRegistration />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: '123' } });
    fireEvent.blur(firstNameInput);
    
    await waitFor(() => {
      expect(screen.getByText(/first name can only contain letters/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<PatientRegistration />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('validates phone number format', async () => {
    render(<PatientRegistration />);
    
    const phoneInput = screen.getByLabelText(/phone number/i);
    fireEvent.change(phoneInput, { target: { value: 'abc' } });
    fireEvent.blur(phoneInput);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });

  test('validates date of birth', async () => {
    render(<PatientRegistration />);
    
    const dobInput = screen.getByLabelText(/date of birth/i);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    fireEvent.change(dobInput, { target: { value: futureDateString } });
    fireEvent.blur(dobInput);
    
    await waitFor(() => {
      expect(screen.getByText(/date of birth cannot be in the future/i)).toBeInTheDocument();
    });
  });

  test('validates password strength', async () => {
    render(<PatientRegistration />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  test('validates password confirmation', async () => {
    render(<PatientRegistration />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123!' } });
    fireEvent.blur(confirmPasswordInput);
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    render(<PatientRegistration />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getAllByRole('button')[0]; // First button is password toggle
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('handles successful form submission', async () => {
    render(<PatientRegistration />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'CA' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Welcome to HealthFirst!')).toBeInTheDocument();
    });
  });

  test('validates emergency contact fields when filled', async () => {
    render(<PatientRegistration />);
    
    const emergencyNameInput = screen.getByLabelText(/emergency contact name/i);
    fireEvent.change(emergencyNameInput, { target: { value: '123' } });
    fireEvent.blur(emergencyNameInput);
    
    await waitFor(() => {
      expect(screen.getByText(/emergency contact name can only contain letters/i)).toBeInTheDocument();
    });
  });

  test('prevents duplicate emergency contact info', async () => {
    render(<PatientRegistration />);
    
    // Fill in patient info
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    
    // Try to use same name for emergency contact
    const emergencyNameInput = screen.getByLabelText(/emergency contact name/i);
    fireEvent.change(emergencyNameInput, { target: { value: 'John' } });
    fireEvent.blur(emergencyNameInput);
    
    await waitFor(() => {
      expect(screen.getByText(/emergency contact cannot be the same as patient/i)).toBeInTheDocument();
    });
  });

  test('navigates to login page', () => {
    const reloadMock = jest.spyOn(window.location, 'reload').mockImplementation(() => {});
    const pushStateMock = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
    
    render(<PatientRegistration />);
    
    const signInLink = screen.getByText('Sign in here');
    fireEvent.click(signInLink);
    
    expect(pushStateMock).toHaveBeenCalledWith({}, '', '/patient');
    expect(reloadMock).toHaveBeenCalled();
    
    reloadMock.mockRestore();
    pushStateMock.mockRestore();
  });
}); 