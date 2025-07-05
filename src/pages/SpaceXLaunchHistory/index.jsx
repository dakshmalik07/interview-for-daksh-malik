import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Dropdown from '../../components/ui/Dropdown';
import Pagination from '../../components/ui/Pagination';
import LaunchModal from '../../components/ui/LaunchModal';
import { fetchSpaceXLaunches } from '../../spacexApi'

const SpaceXLaunchHistory = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('All Time');
  const [selectedLaunchType, setSelectedLaunchType] = useState('All Launches');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [launches, setLaunches] = useState([]);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const periodOptions = [
    'Past 6 Months',
    'Past Year',
    'Past 2 Years',
    'All Time'
  ];

  const launchTypeOptions = [
    'All Launches',
    'Successful Launches',
    'Failed Launches',
    'Upcoming Launches'
  ];

  const launchesPerPage = 10;



  const loadLaunches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchSpaceXLaunches();
      setLaunches(data);
    } catch (err) {
      setError('Failed to load launches. Please try again.');
      console.error('Error loading launches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLaunches = () => {
    let filtered = [...launches];
    const currentDate = new Date();

    // Filter by period
    if (selectedPeriod !== 'All Time') {
      let dateLimit;
      switch (selectedPeriod) {
        case 'Past 6 Months':
          dateLimit = new Date(currentDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
          break;
        case 'Past Year':
          dateLimit = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'Past 2 Years':
          dateLimit = new Date(currentDate.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateLimit = null;
      }
      
      if (dateLimit) {
        filtered = filtered.filter(launch => {
          const launchDate = new Date(launch.date_utc);
          return launchDate >= dateLimit;
        });
      }
    }

    // Filter by launch type - using API fields instead of date calculation
    switch (selectedLaunchType) {
      case 'Successful Launches':
        filtered = filtered.filter(launch => launch.success === true);
        break;
      case 'Failed Launches':
        filtered = filtered.filter(launch => launch.success === false);
        break;
      case 'Upcoming Launches':
        filtered = filtered.filter(launch => launch.upcoming === true);
        break;
      default:
        // All launches - no additional filtering
        break;
    }

    setFilteredLaunches(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatusInfo = (launch) => {
    // Use API fields instead of date comparison
    if (launch.upcoming === true) {
      return {
       status: 'Upcoming',
        statusColor: 'text-[#92400F] bg-[#FEF3C7]'
      };
    } else if (launch.success === true) {
      return {
        status: 'Success',
        statusColor: 'text-green-700 bg-green-100'
      };
    } else if (launch.success === false) {
      return {
        status: 'Failed',
        statusColor: 'text-red-700 bg-red-100'
      };
    } else {
      return {
        status: 'Unknown',
        statusColor: 'text-gray-700 bg-gray-100'
      };
    }
  };

 

  const handleLaunchTypeChange = (type) => {
    setSelectedLaunchType(type);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredLaunches.length / launchesPerPage);
  const startIndex = (currentPage - 1) * launchesPerPage;
  const endIndex = startIndex + launchesPerPage;
  const currentLaunches = filteredLaunches.slice(startIndex, endIndex);

  return (
    <div className="w-full bg-global-5 flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-center gap-8 sm:gap-10 md:gap-11 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters Section */}
        <div className="w-full max-w-[954px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="w-full sm:w-auto">
              <Dropdown
                placeholder="All Time"
                options={periodOptions}
                value={selectedPeriod}
                onChange={handlePeriodChange}
                leftIcon="/images/img_icon.svg"
                rightIcon="/images/img_arrowdown.svg"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <img 
                src="/images/img_frame.svg" 
                alt="Filter" 
                className="w-4 h-4"
              />
              <Dropdown
                placeholder="All Launches"
                options={launchTypeOptions}
                value={selectedLaunchType}
                onChange={handleLaunchTypeChange}
                rightIcon="/images/img_arrowdown.svg"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full max-w-[954px] mx-auto">
          <div className="bg-global-5 border border-[#e4e4e7] rounded-md shadow-[0px_1px_3px_#00000019] overflow-hidden">
            {/* Table Header */}
            <div className="bg-global-2 px-3 sm:px-4 py-2 sm:py-3">
              <div className="hidden md:grid md:grid-cols-12 gap-2 sm:gap-4 text-xs font-inter font-medium leading-4 text-global-3">
                <div className="col-span-1">No:</div>
                <div className="col-span-2">Launched (UTC)</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2">Mission</div>
                <div className="col-span-1 text-center">Orbit</div>
                <div className="col-span-2">Launch Status</div>
                <div className="col-span-2">Rocket</div>
              </div>
              
              {/* Mobile Header */}
              <div className="md:hidden text-xs font-inter font-medium leading-4 text-global-3 text-center">
                Launch History
              </div>
            </div>

            {/* Table Content */}
            <div className="relative">
              {isLoading ? (
                <div className="flex justify-center items-center py-24 sm:py-32 md:py-48">
                  <img 
                    src="/images/img_loader.svg" 
                    alt="Loading" 
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 animate-spin"
                  />
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center py-24 sm:py-32 md:py-48 text-red-600">
                  <div className="text-lg font-medium mb-2">Error Loading Launches</div>
                  <div className="text-sm mb-4">{error}</div>
                  <button 
                    onClick={loadLaunches}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredLaunches.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-24 sm:py-32 md:py-48 text-gray-500">
                  <div className="text-lg font-medium mb-2">No Launches Found</div>
                  <div className="text-sm">Try adjusting your filters</div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentLaunches.map((launch, index) => {
                    const statusInfo = getStatusInfo(launch);
                    const globalIndex = startIndex + index + 1;
                    
                    return (
                      <div 
                        key={launch.id} 
                        className="px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleLaunchClick(launch)}
                      >
                        {/* Desktop Layout */}
                        <div className="hidden md:grid md:grid-cols-12 gap-2 sm:gap-4 items-center text-xs font-inter font-normal leading-4 text-global-2">
                          <div className="col-span-1">{globalIndex.toString().padStart(2, '0')}</div>
                          <div className="col-span-2">{formatDate(launch.date_utc)}</div>
                          <div className="col-span-2">{launch.launchpad?.name || 'Unknown'}</div>
                          <div className="col-span-2">{launch.name}</div>
                          <div className="col-span-1 text-center">{launch.payloads?.[0]?.orbit || 'N/A'}</div>
                          <div className="col-span-2">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-helvetica font-medium ${statusInfo.statusColor}`}>
                              {statusInfo.status}
                            </span>
                          </div>
                          <div className="col-span-2">{launch.rocket?.name || 'Unknown'}</div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="text-xs font-inter font-medium text-global-2">#{globalIndex.toString().padStart(2, '0')}</div>
                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-helvetica font-medium ${statusInfo.statusColor}`}>
                              {statusInfo.status}
                            </span>
                          </div>
                          <div className="text-xs font-inter font-normal text-global-2">
                            <div className="mb-1">{formatDate(launch.date_utc)}</div>
                            <div className="mb-1">{launch.launchpad?.name || 'Unknown'}</div>
                            <div className="mb-1">{launch.name} • {launch.payloads?.[0]?.orbit || 'N/A'}</div>
                            <div>{launch.rocket?.name || 'Unknown'}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pagination - positioned right below the table */}
          {!isLoading && !error && filteredLaunches.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showPrevNext={true}
            />
          )}
        </div>
      </div>

      {/* Launch Details Modal */}
     
    </div>
  );
};

export default SpaceXLaunchHistory;