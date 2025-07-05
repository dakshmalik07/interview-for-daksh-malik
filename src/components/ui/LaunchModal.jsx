import React from 'react';

const LaunchModal = ({ launch, isOpen, onClose }) => {
  if (!isOpen || !launch) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const statusInfo = getStatusInfo(launch);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start p-4 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {/* Mission Patch Image */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {launch.links?.patch?.large ? (
                  <img 
                    src={launch.links.patch.large} 
                    alt="Mission Patch" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20" style={{display: launch.links?.patch?.large ? 'none' : 'block'}}>
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{launch.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{launch.rocket?.name || 'Unknown'}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.statusColor}`}>
                    {statusInfo.status}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {launch.details || 'No mission description available.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none ml-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4">
          {/* Launch Images */}
          {(launch.links?.flickr?.original?.length > 0 || launch.links?.youtube_id) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Launch Images</h4>
              <div className="flex gap-2 overflow-x-auto">
                {/* Flickr Images */}
                {launch.links?.flickr?.original?.slice(0, 3).map((image, index) => (
                  <img
                    key={`flickr-${index}`}
                    src={image}
                    alt={`${launch.name} launch image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
                {/* YouTube Thumbnail as fallback */}
                {launch.links?.youtube_id && launch.links?.flickr?.original?.length === 0 && (
                  <img
                    src={`https://img.youtube.com/vi/${launch.links.youtube_id}/0.jpg`}
                    alt="Webcast Thumbnail"
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Mission Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Flight Number:</span>
              <span className="text-sm font-medium text-gray-900">{launch.flight_number}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mission Name:</span>
              <span className="text-sm font-medium text-gray-900">{launch.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rocket Type:</span>
              <span className="text-sm font-medium text-gray-900">{launch.rocket?.type || 'rocket'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rocket Name:</span>
              <span className="text-sm font-medium text-gray-900">{launch.rocket?.name || 'Unknown'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Manufacturer:</span>
              <span className="text-sm font-medium text-gray-900">SpaceX</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nationality:</span>
              <span className="text-sm font-medium text-gray-900">United States</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Launch Date:</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(launch.date_utc)}</span>
            </div>
            
            {launch.payloads && launch.payloads.length > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payload Type:</span>
                <span className="text-sm font-medium text-gray-900">{launch.payloads[0].type || 'Satellite'}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Orbit:</span>
              <span className="text-sm font-medium text-gray-900">{launch.payloads?.[0]?.orbit || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Launch Site:</span>
              <span className="text-sm font-medium text-gray-900">{launch.launchpad?.name || 'Unknown'}</span>
            </div>
          </div>

          {/* Failure Details */}
          {launch.failures && launch.failures.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-2">Failure Details</h4>
              {launch.failures.map((failure, index) => (
                <div key={index} className="text-sm text-red-700">
                  <div>Time: {failure.time}s after launch</div>
                  <div>Altitude: {failure.altitude}km</div>
                  <div>Reason: {failure.reason}</div>
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          {(launch.links?.webcast || launch.links?.wikipedia || launch.links?.youtube_id) && (
            <div className="flex gap-2 pt-2">
              {launch.links?.webcast && (
                <a
                  href={launch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Watch
                </a>
              )}
              {launch.links?.youtube_id && !launch.links?.webcast && (
                <a
                  href={`https://www.youtube.com/watch?v=${launch.links.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  YouTube
                </a>
              )}
              {launch.links?.wikipedia && (
                <a
                  href={launch.links.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Wikipedia
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchModal;