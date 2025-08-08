# Patient Portal

This directory contains the Patient Portal components for the HealthFirst healthcare application.

## Components

### PatientLogin.jsx
A modern, responsive patient login interface that matches the Provider Portal design.

#### Features:
- **Flexible Login Identifier**: Accepts both email addresses and phone numbers in a single field
- **Auto-format Detection**: Automatically detects whether the input is an email or phone number
- **Real-time Validation**: Shows validation feedback as users type
- **Password Security**: Masked password field with show/hide toggle
- **Remember Me**: Optional checkbox for session persistence
- **Forgot Password**: Link to password recovery flow
- **Responsive Design**: Mobile-first design that scales to desktop
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Design Features:
- Matches Provider Portal styling (soft blue gradients, rounded cards)
- Patient-specific icon (user icon instead of heart)
- Calming, centered layout with good spacing
- Consistent with healthcare design standards

#### Validation Rules:
- **Login Identifier**: Must be a valid email or phone number
- **Password**: Minimum 6 characters required
- **Real-time Feedback**: Visual cues for valid/invalid states
- **Format Hints**: Dynamic placeholder text based on detected format

#### Security Features:
- Password masking by default
- Toggle to show/hide password
- No auto-fill for security-sensitive fields
- Secure form submission handling

#### Error Handling:
- Clear error messages for invalid credentials
- Helpful suggestions for account recovery
- Support contact information
- Graceful handling of network errors

#### Success Flow:
- Welcome message on successful login
- Redirect to patient dashboard
- Session management indicators

### PatientRegistration.jsx
A comprehensive patient registration form with split layout design matching the Provider Registration.

#### Features:
- **Split Layout**: Left panel with welcome message, right panel with form
- **Comprehensive Form Sections**: Personal Info, Address, Emergency Contact, Account Security
- **Real-time Validation**: Field-level validation with immediate feedback
- **Password Strength Indicator**: Visual feedback on password complexity
- **Emergency Contact Validation**: Prevents duplicate contact information
- **Responsive Design**: Mobile-first with proper scaling
- **Success Flow**: Welcome screen with verification steps

#### Form Sections:

**Personal Information:**
- First Name (required, 2-50 chars, letters only)
- Last Name (required, 2-50 chars, letters only)
- Email Address (required, valid format, unique)
- Phone Number (required, valid format)
- Date of Birth (required, past date, min age 13)
- Gender (required dropdown)

**Address:**
- Street Address (required, max 200 chars)
- City (required, max 100 chars)
- State/Province (required, max 50 chars)
- ZIP/Postal Code (required, valid format)

**Emergency Contact (Optional):**
- Emergency Contact Name (optional, max 100 chars)
- Relationship (optional, max 50 chars)
- Emergency Phone Number (optional, valid format)
- Validation prevents duplicate patient info

**Account Security:**
- Password (required, min 8 chars, complexity rules)
- Confirm Password (required, must match)
- Password strength indicator
- Show/hide password toggles

#### Validation Rules:
- **Required Fields**: All personal info, address, and security fields
- **Name Validation**: Letters, spaces, hyphens, apostrophes only
- **Email Validation**: Standard email format
- **Phone Validation**: International phone number format
- **Date Validation**: Past date, minimum age requirement
- **Password Complexity**: Min 8 chars, uppercase, lowercase, number, special char
- **Emergency Contact**: Prevents duplicate patient information
- **Real-time Feedback**: Immediate validation as user types

#### Success Flow:
- **Welcome Screen**: Friendly confirmation with patient name
- **Email Verification**: Instructions for email verification
- **Next Steps**: Preview of dashboard features
- **Navigation**: Redirect to patient dashboard after verification

#### Design Features:
- **Visual Consistency**: Matches Provider Registration exactly
- **Split Layout**: Left panel with marketing content, right with form
- **Responsive Design**: Mobile-first with proper breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Handling**: Clear, user-friendly error messages
- **Loading States**: Spinner and disabled form during submission

## Testing

### PatientLogin.test.jsx
Comprehensive test suite covering:
- Component rendering
- Form validation (email/phone formats)
- Password visibility toggle
- Form submission handling
- Error state management
- User interaction flows

### PatientRegistration.test.jsx
Comprehensive test suite covering:
- Component rendering and form sections
- Required field validation
- Name, email, phone format validation
- Date of birth validation (past dates, minimum age)
- Password strength and confirmation validation
- Emergency contact validation and duplicate prevention
- Form submission and success flow
- Navigation between login and registration

## Usage

The Patient Portal components are integrated into the main App.jsx with portal navigation:

```jsx
// Navigate to patient portal
window.history.pushState({}, '', '/patient');
window.location.reload();

// Navigate to patient registration
window.history.pushState({}, '', '/patient/register');
window.location.reload();
```

## Design Guidelines

The Patient Portal follows the same design system as the Provider Portal:
- **Colors**: Healthcare blue palette (`healthcare-600`, `healthcare-700`)
- **Typography**: Inter font family, consistent sizing
- **Spacing**: Tailwind CSS utility classes for consistent spacing
- **Components**: Rounded cards, subtle shadows, focus states
- **Responsive**: Mobile-first approach with breakpoint scaling

## URL Routing

- `/patient` - Patient Login page
- `/patient/register` - Patient Registration page
- `/login` - Provider Login page
- `/register` - Provider Registration page

## Future Enhancements

- Patient dashboard integration
- Password reset modal
- Multi-factor authentication
- Session management
- Profile completion flow
- Appointment scheduling integration 