import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProviderDashboard from './ProviderDashboard';

describe('ProviderDashboard', () => {
  test('renders provider dashboard with patient list', () => {
    render(<ProviderDashboard />);
    
    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('190')).toBeInTheDocument();
    expect(screen.getByText('Import Clients')).toBeInTheDocument();
    expect(screen.getByText('Add New Patient')).toBeInTheDocument();
  });

  test('renders table headers correctly', () => {
    render(<ProviderDashboard />);
    
    expect(screen.getByText('MRN')).toBeInTheDocument();
    expect(screen.getByText('Patient Name')).toBeInTheDocument();
    expect(screen.getByText('DOB')).toBeInTheDocument();
    expect(screen.getByText('Email ID')).toBeInTheDocument();
    expect(screen.getByText('Contact Number')).toBeInTheDocument();
    expect(screen.getByText('Clinician')).toBeInTheDocument();
    expect(screen.getByText('Member Since')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('renders patient data correctly', () => {
    render(<ProviderDashboard />);
    
    // Check for patient names
    expect(screen.getByText('Robert Fox')).toBeInTheDocument();
    expect(screen.getByText('Eleanor Pena')).toBeInTheDocument();
    expect(screen.getByText('Marvin McKinney')).toBeInTheDocument();
    
    // Check for MRNs
    expect(screen.getByText('AS2456')).toBeInTheDocument();
    expect(screen.getByText('SF5132')).toBeInTheDocument();
    expect(screen.getByText('DF5686')).toBeInTheDocument();
    
    // Check for status badges
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Discharged')).toBeInTheDocument();
  });

  test('filters patients by search term', () => {
    render(<ProviderDashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Robert' } });
    
    expect(screen.getByText('Robert Fox')).toBeInTheDocument();
    expect(screen.queryByText('Eleanor Pena')).not.toBeInTheDocument();
  });

  test('filters patients by email', () => {
    render(<ProviderDashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'tg03@example.com' } });
    
    expect(screen.getByText('Robert Fox')).toBeInTheDocument();
    expect(screen.getByText('tg03@example.com')).toBeInTheDocument();
  });

  test('filters patients by MRN', () => {
    render(<ProviderDashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'AS2456' } });
    
    expect(screen.getByText('AS2456')).toBeInTheDocument();
    expect(screen.getByText('Robert Fox')).toBeInTheDocument();
  });

  test('changes sort dropdown', () => {
    render(<ProviderDashboard />);
    
    const sortDropdown = screen.getByDisplayValue('Name');
    fireEvent.change(sortDropdown, { target: { value: 'mrn' } });
    
    expect(sortDropdown).toHaveValue('mrn');
  });

  test('patient names are clickable links', () => {
    render(<ProviderDashboard />);
    
    const patientLinks = screen.getAllByText(/Robert Fox|Eleanor Pena|Marvin McKinney/);
    patientLinks.forEach(link => {
      expect(link).toHaveClass('text-healthcare-600');
    });
  });

  test('shows information icon for Robert Fox', () => {
    render(<ProviderDashboard />);
    
    // The information icon should be present for Robert Fox
    const infoIcons = screen.getAllByTestId('information-circle-icon');
    expect(infoIcons.length).toBeGreaterThan(0);
  });

  test('action buttons are present', () => {
    render(<ProviderDashboard />);
    
    // Check for ellipsis buttons in action column
    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  test('status badges have correct colors', () => {
    render(<ProviderDashboard />);
    
    const newStatus = screen.getByText('New');
    const activeStatus = screen.getByText('Active');
    const dischargedStatus = screen.getByText('Discharged');
    
    expect(newStatus).toHaveClass('bg-blue-100', 'text-blue-800');
    expect(activeStatus).toHaveClass('bg-green-100', 'text-green-800');
    expect(dischargedStatus).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  test('table has hover effects', () => {
    render(<ProviderDashboard />);
    
    const tableRows = screen.getAllByRole('row');
    // Skip header row
    const dataRows = tableRows.slice(1);
    
    dataRows.forEach(row => {
      expect(row).toHaveClass('hover:bg-gray-50');
    });
  });
}); 