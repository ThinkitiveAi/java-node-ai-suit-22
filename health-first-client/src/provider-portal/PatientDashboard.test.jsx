import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import PatientDashboard from './PatientDashboard';

// Mock Heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  MagnifyingGlassIcon: () => <div data-testid="magnifying-glass-icon" />,
  BellIcon: () => <div data-testid="bell-icon" />,
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
  EllipsisVerticalIcon: () => <div data-testid="ellipsis-vertical-icon" />,
  PlusIcon: () => <div data-testid="plus-icon" />,
  UserCircleIcon: () => <div data-testid="user-circle-icon" />,
}));

describe('PatientDashboard', () => {
  beforeEach(() => {
    // Mock window.history.pushState
    Object.defineProperty(window, 'history', {
      value: {
        pushState: vi.fn(),
      },
      writable: true,
    });
  });

  test('renders the navigation bar with correct elements', () => {
    render(<PatientDashboard />);
    
    // Check for logo
    expect(screen.getByText('Sample EMR')).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('Communications')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Referral')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Check for icons
    expect(screen.getByTestId('magnifying-glass-icon')).toBeInTheDocument();
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    expect(screen.getByTestId('user-circle-icon')).toBeInTheDocument();
  });

  test('renders the main content area with page title', () => {
    render(<PatientDashboard />);
    
    expect(screen.getByText('Patients List')).toBeInTheDocument();
    expect(screen.getByText('New Patient')).toBeInTheDocument();
  });

  test('renders patient table with correct columns', () => {
    render(<PatientDashboard />);
    
    // Check table headers
    expect(screen.getByText('Patient ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Last Visit')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('renders sample patient data', () => {
    render(<PatientDashboard />);
    
    // Check for sample patients
    expect(screen.getByText('Heena West')).toBeInTheDocument();
    expect(screen.getByText('Arlene McCoy')).toBeInTheDocument();
    expect(screen.getByText('Esther Howard')).toBeInTheDocument();
    expect(screen.getByText('Jane Cooper')).toBeInTheDocument();
    expect(screen.getByText('Darrell Steward')).toBeInTheDocument();
    
    // Check for patient IDs
    expect(screen.getByText('#456344')).toBeInTheDocument();
    expect(screen.getByText('#63454')).toBeInTheDocument();
    expect(screen.getByText('#379843')).toBeInTheDocument();
    
    // Check for contact details
    expect(screen.getByText('(239) 555-0108')).toBeInTheDocument();
    expect(screen.getByText('(316) 555-0116')).toBeInTheDocument();
    expect(screen.getByText('(302) 555-0107')).toBeInTheDocument();
  });

  test('renders pagination controls', () => {
    render(<PatientDashboard />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    // Only 2 pages exist for 15 patients with 11 per page
  });

  test('shows correct results counter', () => {
    render(<PatientDashboard />);
    
    expect(screen.getByText(/Showing 1 to 11 of 15 results/)).toBeInTheDocument();
  });

  test('handles pagination correctly', () => {
    render(<PatientDashboard />);
    
    // Initially page 1 should be active
    const page1Button = screen.getByText('01');
    expect(page1Button).toHaveClass('bg-healthcare-600');
    
    // Click on page 2
    const page2Button = screen.getByText('02');
    fireEvent.click(page2Button);
    
    // Page 2 should now be active
    expect(page2Button).toHaveClass('bg-healthcare-600');
    expect(page1Button).not.toHaveClass('bg-healthcare-600');
  });

  test('handles sorting correctly', () => {
    render(<PatientDashboard />);
    
    // Click on Patient ID header to sort
    const patientIdHeader = screen.getByText('Patient ID');
    fireEvent.click(patientIdHeader);
    
    // Should show sort indicator (there are 2 chevron icons - one in nav, one in sorting)
    expect(screen.getAllByTestId('chevron-down-icon')).toHaveLength(2);
  });

  test('handles action menu correctly', () => {
    render(<PatientDashboard />);
    
    // Find and click the first action menu button
    const actionButtons = screen.getAllByTestId('ellipsis-vertical-icon');
    fireEvent.click(actionButtons[0]);
    
    // Should show action menu options
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Edit Patient')).toBeInTheDocument();
    expect(screen.getByText('Schedule Appointment')).toBeInTheDocument();
    expect(screen.getByText('Delete Patient')).toBeInTheDocument();
  });

  test('handles new patient button click', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    render(<PatientDashboard />);
    
    const newPatientButton = screen.getByText('New Patient');
    fireEvent.click(newPatientButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('New Patient button clicked');
    consoleSpy.mockRestore();
  });

  test('handles navigation clicks', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
    render(<PatientDashboard />);
    
    const dashboardButton = screen.getByText('Dashboard');
    fireEvent.click(dashboardButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Navigation clicked: Dashboard');
    consoleSpy.mockRestore();
  });

  test('renders patient avatars correctly', () => {
    render(<PatientDashboard />);
    
    // Check for avatar initials
    expect(screen.getByText('HW')).toBeInTheDocument();
    expect(screen.getByText('AM')).toBeInTheDocument();
    expect(screen.getByText('EH')).toBeInTheDocument();
    expect(screen.getByText('JC')).toBeInTheDocument();
    expect(screen.getByText('DS')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<PatientDashboard />);
    
    // Check for proper table structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Check for proper button roles
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('handles responsive design elements', () => {
    render(<PatientDashboard />);
    
    // Check that navigation menu is hidden on mobile (has hidden md:block class)
    const navigationMenu = screen.getByText('Dashboard').closest('div');
    expect(navigationMenu).toHaveClass('hidden');
    expect(navigationMenu).toHaveClass('md:block');
  });

  test('handles search functionality', () => {
    render(<PatientDashboard />);
    
    // Initially should show all patients
    expect(screen.getByText('Heena West')).toBeInTheDocument();
    expect(screen.getByText('Arlene McCoy')).toBeInTheDocument();
    
    // Search for a specific patient
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Heena' } });
    
    // Should still show Heena West
    expect(screen.getByText('Heena West')).toBeInTheDocument();
    
    // Search for non-existent patient
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    
    // Should not show any patients
    expect(screen.queryByText('Heena West')).not.toBeInTheDocument();
  });
});
