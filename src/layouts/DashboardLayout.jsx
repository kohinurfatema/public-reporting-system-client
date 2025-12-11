// src/layouts/DashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router';
// NOTE: If you have a shared Dashboard Header/Navbar that appears on ALL roles,
// you would include it here, above the <Outlet />.

const DashboardLayout = () => {
    return (
        // This container wrapper ensures the dashboard content spans a good height
        // and provides a background color for visual separation from the main site.
        <div className="min-h-screen bg-base-200">
            {/* The <Outlet /> component is crucial here. 
                It renders the current nested route element, 
                which in your case is the <CitizenDashboard /> component.
            */}
            <Outlet />
        </div>
    );
};

export default DashboardLayout;