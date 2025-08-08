import React, { useState, useEffect } from 'react';
import ProviderLogin from './provider-portal/Login.jsx';
import ProviderRegister from './provider-portal/ProviderRegister';
import ProviderDashboard from './provider-portal/ProviderDashboard';
import PatientLogin from './patient-portal/PatientLogin';
import PatientRegistration from './patient-portal/PatientRegistration';

function App() {
  const [currentPage, setCurrentPage] = useState('provider-login');
  const [portal, setPortal] = useState('provider'); // 'provider' or 'patient'

  // Handle URL-based routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/register') {
      setCurrentPage('register');
      setPortal('provider');
    } else if (path === '/patient') {
      setCurrentPage('patient-login');
      setPortal('patient');
    } else if (path === '/patient/register') {
      setCurrentPage('patient-register');
      setPortal('patient');
    } else if (path === '/provider/dashboard') {
      setCurrentPage('provider-dashboard');
      setPortal('provider');
    } else {
      setCurrentPage('login');
      setPortal('provider');
    }
  }, []);

  // Update URL when page changes
  const navigateTo = (page, portalType = 'provider') => {
    setCurrentPage(page);
    setPortal(portalType);
    let path = '/login';
    if (page === 'register') path = '/register';
    else if (page === 'patient-login') path = '/patient';
    else if (page === 'patient-register') path = '/patient/register';
    else if (page === 'provider-dashboard') path = '/provider/dashboard';
    window.history.pushState({}, '', path);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/register') {
        setCurrentPage('register');
        setPortal('provider');
      } else if (path === '/patient') {
        setCurrentPage('patient-login');
        setPortal('patient');
      } else if (path === '/patient/register') {
        setCurrentPage('patient-register');
        setPortal('patient');
      } else if (path === '/provider/dashboard') {
        setCurrentPage('provider-dashboard');
        setPortal('provider');
      } else {
        setCurrentPage('login');
        setPortal('provider');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderContent = () => {
    if (portal === 'patient') {
      if (currentPage === 'patient-register') {
        return <PatientRegistration />;
      }
      return <PatientLogin />;
    }
    
    if (portal === 'provider') {
      if (currentPage === 'provider-dashboard') {
        return <ProviderDashboard />;
      } else if (currentPage === 'register') {
        return <ProviderRegister />;
      } else {
        return <ProviderLogin />;
      }
    }
    
    return <ProviderLogin />;
  };

  return (
    <div className="App">
      {/* Portal Navigation - Only show on login/register pages */}
      {currentPage !== 'provider-dashboard' && (
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-2">
            <button
              onClick={() => navigateTo('login', 'provider')}
              className={`px-3 py-1 text-sm rounded ${
                portal === 'provider' 
                  ? 'bg-healthcare-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Provider
            </button>
            <button
              onClick={() => navigateTo('patient-login', 'patient')}
              className={`px-3 py-1 text-sm rounded ${
                portal === 'patient' 
                  ? 'bg-healthcare-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Patient
            </button>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

export default App; 