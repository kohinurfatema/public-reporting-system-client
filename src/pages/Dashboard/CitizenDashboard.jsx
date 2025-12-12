// src/pages/Dashboard/CitizenDashboard.jsx

import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth';

const CitizenDashboard = () => {
    const { user } = useAuth();
    const location = useLocation(); // Retained but less necessary with Outlet focus

    // Define the sidebar links for the Citizen Role (using kebab-case paths)
    const citizenLinks = (
        <>
            <li>
                <NavLink to="/dashboard/citizen" end>
                    Citizen Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/citizen/report-issue">
                    Report New Issue
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/citizen/my-issues">
                    My Reported Issues
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/citizen/profile">
                    Profile & Subscription
                </NavLink>
            </li>
            <div className="divider">General</div>
            <li><NavLink to="/">Home Page</NavLink></li>
        </>
    );

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            {/* --- CONTENT AREA --- */}
            <div className="drawer-content flex flex-col items-start justify-start p-4 md:p-8">
                {/* The Outlet now handles ALL content for nested routes, 
                    including the index route which should render CitizenDashboardHome.jsx */}
                <Outlet />

                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden fixed bottom-4 right-4 z-40">
                    Menu
                </label>
            </div>

            {/* --- Sidebar --- */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
                    <li className="menu-title">
                         {user?.displayName || 'Citizen'} Dashboard
                    </li>
                    {citizenLinks}
                </ul>
            </div>
        </div>
    );
};

export default CitizenDashboard;