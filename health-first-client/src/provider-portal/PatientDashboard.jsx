import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChevronDownIcon, 
  EllipsisVerticalIcon,
  PlusIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const PatientDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Sample patient data matching the requirements
  const patients = [
    {
      id: '456344',
      name: 'Heena West',
      dob: '22-07-1940',
      contact: '(239) 555-0108',
      lastVisit: '-',
      avatar: 'HW'
    },
    {
      id: '63454',
      name: 'Arlene McCoy',
      dob: '18-08-1940',
      contact: '(316) 555-0116',
      lastVisit: '-',
      avatar: 'AM'
    },
    {
      id: '379843',
      name: 'Esther Howard',
      dob: '05-02-1941',
      contact: '(302) 555-0107',
      lastVisit: '-',
      avatar: 'EH'
    },
    {
      id: '433475',
      name: 'Jane Cooper',
      dob: '12-12-1941',
      contact: '(308) 555-0121',
      lastVisit: '-',
      avatar: 'JC'
    },
    {
      id: '540982',
      name: 'Darrell Steward',
      dob: '01-01-1942',
      contact: '(219) 555-0114',
      lastVisit: '-',
      avatar: 'DS'
    },
    {
      id: '123456',
      name: 'Bessie Cooper',
      dob: '15-03-1942',
      contact: '(555) 555-0123',
      lastVisit: '-',
      avatar: 'BC'
    },
    {
      id: '789012',
      name: 'Jackson Smith',
      dob: '20-06-1943',
      contact: '(555) 555-0124',
      lastVisit: '-',
      avatar: 'JS'
    },
    {
      id: '345678',
      name: 'Ethan Johnson',
      dob: '08-09-1943',
      contact: '(555) 555-0125',
      lastVisit: '-',
      avatar: 'EJ'
    },
    {
      id: '901234',
      name: 'Liam Brown',
      dob: '14-11-1944',
      contact: '(555) 555-0126',
      lastVisit: '-',
      avatar: 'LB'
    },
    {
      id: '567890',
      name: 'Noah Davis',
      dob: '03-04-1945',
      contact: '(555) 555-0127',
      lastVisit: '-',
      avatar: 'ND'
    },
    {
      id: '234567',
      name: 'Mason Wilson',
      dob: '25-07-1945',
      contact: '(555) 555-0128',
      lastVisit: '-',
      avatar: 'MW'
    },
    {
      id: '890123',
      name: 'Lucas Taylor',
      dob: '10-10-1946',
      contact: '(555) 555-0129',
      lastVisit: '-',
      avatar: 'LT'
    },
    {
      id: '456789',
      name: 'Aiden Anderson',
      dob: '17-12-1946',
      contact: '(555) 555-0130',
      lastVisit: '-',
      avatar: 'AA'
    },
    {
      id: '012345',
      name: 'Carter Thomas',
      dob: '29-01-1947',
      contact: '(555) 555-0131',
      lastVisit: '-',
      avatar: 'CT'
    },
    {
      id: '678901',
      name: 'Leslie Alexander',
      dob: '05-05-1947',
      contact: '(555) 555-0132',
      lastVisit: '-',
      avatar: 'LA'
    }
  ];

  const navigationItems = [
    'Dashboard',
    'Scheduling', 
    'Patients',
    'Communications',
    'Billing',
    'Referral',
    'Reports',
    'Settings'
  ];

  // Filter and sort patients
  const filteredPatients = patients
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'dob':
          aValue = new Date(a.dob.split('-').reverse().join('-'));
          bValue = new Date(b.dob.split('-').reverse().join('-'));
          break;
        case 'lastVisit':
          aValue = a.lastVisit;
          bValue = b.lastVisit;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const itemsPerPage = 11;
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // Generate page numbers for pagination (show up to 5 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(5, totalPages);
    for (let i = 1; i <= maxPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleActionMenu = (patientId, event) => {
    event.stopPropagation();
    setShowActionMenu(showActionMenu === patientId ? null : patientId);
  };

  const handleNewPatient = () => {
    console.log('New Patient button clicked');
    // TODO: Implement new patient functionality
  };

  const handleNavigationClick = (item) => {
    console.log(`Navigation clicked: ${item}`);
    // TODO: Implement navigation routing
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">Sample EMR</h1>
              </div>

              {/* Navigation Menu */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  {navigationItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleNavigationClick(item)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item === 'Patients'
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Search, Notifications, Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Messages/Notifications */}
              <div className="relative">
                <button className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700 transition-colors">
                  <div className="relative">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </div>
                </button>
              </div>

              {/* Bell Icon */}
              <button className="text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700 transition-colors">
                <BellIcon className="h-5 w-5" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700 transition-colors">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Patients List</h1>
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500 w-64"
              />
            </div>
            <button
              onClick={handleNewPatient}
              className="flex items-center space-x-2 px-4 py-2 bg-healthcare-600 text-white rounded-md text-sm font-medium hover:bg-healthcare-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthcare-500 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Patient</span>
            </button>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Patient ID</span>
                      {sortBy === 'id' && (
                        <ChevronDownIcon className={`h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {sortBy === 'name' && (
                        <ChevronDownIcon className={`h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('dob')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date of Birth</span>
                      {sortBy === 'dob' && (
                        <ChevronDownIcon className={`h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('lastVisit')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Visit</span>
                      {sortBy === 'lastVisit' && (
                        <ChevronDownIcon className={`h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPatients.map((patient, index) => (
                  <tr 
                    key={patient.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-healthcare-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-healthcare-800">
                            {patient.avatar}
                          </span>
                        </div>
                        <button className="text-sm font-medium text-healthcare-600 hover:text-healthcare-700 hover:underline focus:outline-none">
                          {patient.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.dob}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={(e) => handleActionMenu(patient.id, e)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded hover:bg-gray-100"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Action Dropdown Menu */}
                        {showActionMenu === patient.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View Details
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Edit Patient
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Schedule Appointment
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              Delete Patient
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-healthcare-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {String(pageNum).padStart(2, '0')}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close action menu */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
