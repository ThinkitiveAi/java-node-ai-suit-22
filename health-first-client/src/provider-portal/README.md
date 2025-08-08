# Provider Portal

This directory contains the Provider Portal components for the HealthFirst healthcare application.

## Components

### Login.jsx
A modern, responsive provider login interface with secure authentication.

#### Features:
- **Email/Password Authentication**: Secure login with validation
- **Password Security**: Masked password field with show/hide toggle
- **Remember Me**: Optional checkbox for session persistence
- **Forgot Password**: Modal with OTP-based password reset
- **Real-time Validation**: Immediate feedback for form errors
- **Loading States**: Spinner and disabled form during authentication
- **Navigation**: Links to registration and patient portal

#### Design Features:
- Matches healthcare design standards (soft blue gradients, rounded cards)
- Provider-specific icon and messaging
- Professional, trustworthy appearance
- Consistent with patient portal styling

#### Security Features:
- Password masking by default
- Toggle to show/hide password
- Secure form submission handling
- Session management indicators

### ProviderRegister.jsx
A comprehensive provider registration form with split layout design.

#### Features:
- **Split Layout**: Left panel with marketing content, right with form
- **Comprehensive Form Sections**: Personal Info, Professional Info, Address, Security
- **Real-time Validation**: Field-level validation with immediate feedback
- **Password Strength Indicator**: Visual feedback on password complexity
- **Profile Picture Upload**: Image upload with preview and validation
- **Responsive Design**: Mobile-first with proper scaling
- **Success Flow**: Welcome screen with verification steps

#### Form Sections:
- **Personal Information**: Name, email, phone, profile picture
- **Professional Information**: Specialization, license, experience
- **Address**: Complete address information
- **Account Security**: Password with strength requirements

### ProviderDashboard.jsx
A comprehensive patient management dashboard with table view.

#### Features:
- **Patient List Table**: Complete patient information display
- **Search Functionality**: Real-time search across patient data
- **Sorting Options**: Dropdown for sorting by different criteria
- **Status Management**: Color-coded status badges
- **Action Buttons**: Import clients and add new patient
- **Responsive Design**: Mobile-friendly table layout
- **Interactive Elements**: Clickable patient names, action menus

#### Table Columns:
- **MRN**: Medical Record Number
- **Patient Name**: Clickable links with info icons
- **DOB**: Date of birth in M/D/YY format
- **Email ID**: Patient email addresses
- **Contact Number**: Formatted phone numbers
- **Clinician**: Provider name and role
- **Member Since**: Registration date
- **Payment Method**: Insurance or self-pay
- **Status**: Color-coded badges (New, Active, Discharged)
- **Action**: Three-dot menu for additional actions

#### Status Badges:
- **New**: Light blue badge
- **Active**: Light green badge
- **Discharged**: Orange badge

#### Interactive Features:
- **Search**: Filter by name, email, or MRN
- **Sorting**: Sort by name, MRN, status, or member date
- **Patient Links**: Clickable patient names for detailed view
- **Action Menus**: Three-dot menus for each patient
- **Import/Add**: Buttons for bulk import and new patient creation

## Testing

### Login.test.jsx
Comprehensive test suite covering:
- Component rendering and form validation
- Password visibility toggle
- Form submission and error handling
- Navigation between portals
- Modal functionality

### ProviderRegister.test.jsx
Comprehensive test suite covering:
- Component rendering and form sections
- Required field validation
- File upload functionality
- Password strength validation
- Form submission and success flow
- Navigation between login and registration

### ProviderDashboard.test.jsx
Comprehensive test suite covering:
- Dashboard rendering and table display
- Search functionality across patient data
- Sorting dropdown functionality
- Status badge color coding
- Interactive elements and hover effects
- Patient data display accuracy

## Usage

The Provider Portal components are integrated into the main App.jsx with portal navigation:

```jsx
// Navigate to provider portal
window.history.pushState({}, '', '/login');
window.location.reload();

// Navigate to provider dashboard (after login)
window.history.pushState({}, '', '/provider/dashboard');
window.location.reload();
```

## URL Routing

- `/login` - Provider Login page
- `/register` - Provider Registration page
- `/provider/dashboard` - Provider Dashboard (patient list)
- `/patient` - Patient Login page
- `/patient/register` - Patient Registration page

## Design Guidelines

The Provider Portal follows a consistent design system:
- **Colors**: Healthcare blue palette (`healthcare-600`, `healthcare-700`)
- **Typography**: Inter font family, consistent sizing
- **Spacing**: Tailwind CSS utility classes for consistent spacing
- **Components**: Rounded cards, subtle shadows, focus states
- **Responsive**: Mobile-first approach with breakpoint scaling

## Authentication Flow

1. **Provider Login** (`/login`) → Authentication
2. **Successful Login** → Redirect to Provider Dashboard (`/provider/dashboard`)
3. **Dashboard** → Patient management, search, sorting, actions
4. **Navigation** → Links to registration and patient portal

## Future Enhancements

- Patient detail views and editing
- Appointment scheduling integration
- Advanced filtering and search
- Bulk operations and data export
- Real-time notifications
- Provider profile management 