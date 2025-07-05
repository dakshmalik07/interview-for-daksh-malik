// SpaceX API Service
const SPACEX_API_BASE_URL = 'https://api.spacexdata.com/v4';

export const fetchSpaceXLaunches = async () => {
  try {
    const response = await fetch(`${SPACEX_API_BASE_URL}/launches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const launches = await response.json();
    
    // Fetch additional details for each launch
    const launchesWithDetails = await Promise.all(
      launches.map(async (launch) => {
        try {
          // Fetch rocket details
          const rocketResponse = await fetch(`${SPACEX_API_BASE_URL}/rockets/${launch.rocket}`);
          const rocketData = rocketResponse.ok ? await rocketResponse.json() : null;

          // Fetch launchpad details
          const launchpadResponse = await fetch(`${SPACEX_API_BASE_URL}/launchpads/${launch.launchpad}`);
          const launchpadData = launchpadResponse.ok ? await launchpadResponse.json() : null;

          // Fetch payload details
          const payloadPromises = launch.payloads.map(async (payloadId) => {
            const payloadResponse = await fetch(`${SPACEX_API_BASE_URL}/payloads/${payloadId}`);
            return payloadResponse.ok ? await payloadResponse.json() : null;
          });
          const payloadData = await Promise.all(payloadPromises);

          return {
            ...launch,
            rocket: rocketData,
            launchpad: launchpadData,
            payloads: payloadData.filter(Boolean), // Remove null values
          };
        } catch (error) {
          console.error(`Error fetching details for launch ${launch.id}:`, error);
          return {
            ...launch,
            rocket: null,
            launchpad: null,
            payloads: [],
          };
        }
      })
    );

    // Sort launches by date (newest first)
    return launchesWithDetails.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
  } catch (error) {
    console.error('Error fetching SpaceX launches:', error);
    throw error;
  }
};

// Alternative: Use the query endpoint for more efficient filtering
export const fetchSpaceXLaunchesQuery = async (queryOptions = {}) => {
  try {
    const defaultQuery = {
      query: {}, // Empty query to get all launches
      options: {
        sort: { date_utc: -1 }, // Sort by date descending (newest first)
        limit: 100, // Adjust limit as needed
        populate: [
          'rocket',
          'launchpad',
          'payloads'
        ]
      }
    };

    // Merge with provided query options
    const queryPayload = {
      ...defaultQuery,
      ...queryOptions,
      options: {
        ...defaultQuery.options,
        ...queryOptions.options
      }
    };

    const response = await fetch(`${SPACEX_API_BASE_URL}/launches/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.docs || [];
  } catch (error) {
    console.error('Error fetching SpaceX launches with query:', error);
    throw error;
  }
};

// Specific function to get upcoming launches using the API field
export const fetchUpcomingLaunches = async () => {
  return fetchSpaceXLaunchesQuery({
    query: { upcoming: true },
    options: {
      sort: { date_utc: 1 }, // Sort upcoming launches by date ascending (earliest first)
      limit: 50,
      populate: ['rocket', 'launchpad', 'payloads']
    }
  });
};

// Specific function to get successful launches
export const fetchSuccessfulLaunches = async () => {
  return fetchSpaceXLaunchesQuery({
    query: { success: true },
    options: {
      sort: { date_utc: -1 }, // Sort by date descending (newest first)
      limit: 100,
      populate: ['rocket', 'launchpad', 'payloads']
    }
  });
};

// Specific function to get failed launches
export const fetchFailedLaunches = async () => {
  return fetchSpaceXLaunchesQuery({
    query: { success: false },
    options: {
      sort: { date_utc: -1 }, // Sort by date descending (newest first)
      limit: 100,
      populate: ['rocket', 'launchpad', 'payloads']
    }
  });
};

export const fetchLaunchDetails = async (launchId) => {
  try {
    const response = await fetch(`${SPACEX_API_BASE_URL}/launches/${launchId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const launch = await response.json();
    
    // Fetch additional details
    const [rocketResponse, launchpadResponse] = await Promise.all([
      fetch(`${SPACEX_API_BASE_URL}/rockets/${launch.rocket}`),
      fetch(`${SPACEX_API_BASE_URL}/launchpads/${launch.launchpad}`)
    ]);

    const rocketData = rocketResponse.ok ? await rocketResponse.json() : null;
    const launchpadData = launchpadResponse.ok ? await launchpadResponse.json() : null;

    // Fetch payload details
    const payloadPromises = launch.payloads.map(async (payloadId) => {
      const payloadResponse = await fetch(`${SPACEX_API_BASE_URL}/payloads/${payloadId}`);
      return payloadResponse.ok ? await payloadResponse.json() : null;
    });
    const payloadData = await Promise.all(payloadPromises);

    return {
      ...launch,
      rocket: rocketData,
      launchpad: launchpadData,
      payloads: payloadData.filter(Boolean),
    };
  } catch (error) {
    console.error('Error fetching launch details:', error);
    throw error;
  }
};