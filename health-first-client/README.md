# HealthFirst Client Application

A modern, responsive healthcare application built with React and Tailwind CSS, featuring separate portals for healthcare providers and patients.

## Features

### Provider Portal
- **Secure Login Interface**: Professional login form with real-time validation
- **Provider Registration**: Comprehensive registration form with split layout design
- **Form Validation**: Email format validation, password strength requirements
- **Interactive States**: Loading, error, and success states with proper feedback
- **Security Features**: Password masking with show/hide toggle
- **Responsive Design**: Mobile-optimized layout with touch-friendly controls
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### Patient Portal
- Coming soon...

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Heroicons**: Beautiful, hand-crafted SVG icons
- **React Scripts**: Create React App build tools

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd health-first-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
health-first-client/
├── public/
│   ├── index.html          # Main HTML file
│   └── manifest.json       # PWA manifest
├── src/
│   ├── provider-portal/
│   │   ├── Login.js        # Provider login component
│   │   ├── Login.test.js   # Login component tests
│   │   ├── ProviderRegister.jsx  # Provider registration component
│   │   └── ProviderRegister.test.js  # Registration component tests
│   ├── patient-portal/     # Patient portal components (coming soon)
│   ├── App.js             # Main app component
│   ├── index.js           # React entry point
│   └── index.css          # Global styles with Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## Provider Portal Features

### Login Interface
- **Form Fields**: Email input, password input with show/hide toggle
- **Validation**: Email format validation, password minimum length
- **Interactive States**: Loading, error, and success states
- **Security**: Password masking, HIPAA compliance indicators
- **Responsive**: Mobile-optimized with touch-friendly controls

### Registration Interface
- **Split Layout**: Left side with marketing content, right side with form
- **Form Sections**:
  - **Personal Information**: First name, last name, email, phone
  - **Professional Information**: Specialization, license number, years of experience
  - **Clinic Address**: Street address, city, state, ZIP code
  - **Account Security**: Password with strength indicator, confirm password
- **Validation Rules**:
  - Required field validation
  - Email and phone format validation
  - Medical license number (alphanumeric only)
  - Years of experience (0-50 range)
  - ZIP code format validation
  - Password strength requirements (8+ chars, uppercase, lowercase, number, special char)
  - Password confirmation matching
- **Interactive Features**:
  - Real-time validation feedback
  - Password strength indicator with visual feedback
  - Password visibility toggles
  - Loading states during form submission
  - Success/error message handling
- **Marketing Content**:
  - Professional doctor image placeholder
  - Trust badges and statistics
  - HIPAA compliance indicators
  - Call-to-action messaging

### Validation Rules
- Email format validation (real-time)
- Required field validation
- Password minimum length (8 characters)
- Password strength requirements (uppercase, lowercase, number, special character)
- Real-time validation feedback

### Interactive States
- **Default**: Clean form ready for input
- **Loading**: Submit button shows spinner, form disabled
- **Error**: Clear error messages for validation and submission failures
- **Success**: Success indicator before redirect

### Security Features
- Password masked by default
- Secure show/hide password toggle
- Form submission protection
- HIPAA compliance indicators
- Password strength requirements

### Responsive Design
- Mobile-optimized layout
- Touch-friendly button and input sizes
- Adaptive spacing for various screen sizes
- Support for both orientations
- Split layout adapts to single column on mobile

## Customization

### Colors
The application uses a custom healthcare color palette defined in `tailwind.config.js`:

- Primary colors: Blue shades for general UI
- Healthcare colors: Teal/blue shades for healthcare-specific elements

### Styling
Custom CSS classes are defined in `src/index.css`:
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.input-field` - Form input styling
- `.input-error` - Error state styling
- `.error-message` - Error text styling
- `.success-message` - Success text styling

## Development

### Adding New Components
1. Create new components in the appropriate portal directory
2. Follow the existing naming conventions
3. Use Tailwind CSS classes for styling
4. Implement proper accessibility features
5. Add comprehensive tests

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the established color palette
- Ensure responsive design
- Maintain accessibility standards

### Testing
- All components include comprehensive test suites
- Tests cover form validation, user interactions, and edge cases
- Use React Testing Library for component testing
- Mock external dependencies appropriately

## Security Considerations

- Form inputs are properly sanitized
- Password fields use appropriate input types
- CSRF protection ready for backend integration
- HIPAA compliance indicators included
- Password strength requirements enforced

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Add proper comments and documentation
3. Test on multiple devices and browsers
4. Ensure accessibility compliance
5. Write comprehensive tests for new features

## License

This project is licensed under the MIT License. 