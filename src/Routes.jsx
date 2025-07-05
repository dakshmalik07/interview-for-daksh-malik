import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import SpaceXLaunchHistoryPage from './pages/SpaceXLaunchHistory';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/spacex-launch-history" element={<SpaceXLaunchHistoryPage />} />
        <Route path="/" element={<SpaceXLaunchHistoryPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;