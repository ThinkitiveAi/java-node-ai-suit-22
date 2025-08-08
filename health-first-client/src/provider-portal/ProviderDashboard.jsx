import React, { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, ArrowUpTrayIcon, PlusIcon, EllipsisVerticalIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const ProviderDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Sample patient data
  const patients = [
    {
      mrn: 'AS2456',
      name: 'Robert Fox',
      dob: '1/31/14',
      email: 'tg03@example.com',
      contact: '(603) 555-0123',
      clinician: 'Theresa Webb (Psychiatrist)',
      memberSince: '6/21/19',
      paymentMethod: 'Self Pay',
      status: 'New',
      hasInfo: true
    },
    {
      mrn: 'SF5132',
      name: 'Eleanor Pena',
      dob: '8/2/19',
      email: 'js02@example.com',
      contact: '(217) 555-0113',
      clinician: 'Kathryn Murphy (Custodian)',
      memberSince: '1/31/14',
      paymentMethod: 'United Healthcare',
      status: 'Active',
      hasInfo: false
    },
    {
      mrn: 'DF5686',
      name: 'Marvin McKinney',
      dob: '3/15/17',
      email: 'mk45@example.com',
      contact: '(415) 555-0129',
      clinician: 'Jacob Jones (Supervisor)',
      memberSince: '9/12/18',
      paymentMethod: 'Self Pay',
      status: 'Discharged',
      hasInfo: false
    },
    {
      mrn: 'RT4521',
      name: 'Ralph Edwards',
      dob: '11/8/16',
      email: 're78@example.com',
      contact: '(312) 555-0147',
      clinician: 'Theresa Webb (Psychiatrist)',
      memberSince: '4/5/19',
      paymentMethod: 'United Healthcare',
      status: 'Discharged',
      hasInfo: false
    },
    {
      mrn: 'HJ4586',
      name: 'Eleanor Pena',
      dob: '5/22/15',
      email: 'ep92@example.com',
      contact: '(555) 555-0199',
      clinician: 'Kathryn Murphy (Custodian)',
      memberSince: '7/14/20',
      paymentMethod: 'Self Pay',
      status: 'Active',
      hasInfo: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Discharged':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              190
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500"
              >
                <option value="name">Name</option>
                <option value="mrn">MRN</option>
                <option value="status">Status</option>
                <option value="memberSince">Member Since</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Bar */}
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

            {/* Import Clients Button */}
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-healthcare-500">
              <ArrowUpTrayIcon className="h-4 w-4" />
              <span>Import Clients</span>
            </button>

            {/* Add New Patient Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-healthcare-600 text-white rounded-md text-sm font-medium hover:bg-healthcare-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-healthcare-500">
              <PlusIcon className="h-4 w-4" />
              <span>Add New Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MRN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DOB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clinician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Since
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.mrn} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.mrn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="text-sm font-medium text-healthcare-600 hover:text-healthcare-700 focus:outline-none">
                          {patient.name}
                        </button>
                        {patient.hasInfo && (
                          <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.dob}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.clinician}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.memberSince}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard; 