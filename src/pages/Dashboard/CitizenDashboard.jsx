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
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Mobile Menu Button - Top Header Bar */}
                <div className="sticky top-0 z-30 flex h-16 w-full items-center bg-base-200 bg-opacity-90 backdrop-blur lg:hidden px-4 shadow-sm">
                    <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        Menu
                    </label>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-4 md:p-8 w-full">
                    <Outlet />
                </div>
            </div>

            {/* --- Sidebar --- */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl">
                    <li className="menu-title text-lg">
                         {user?.displayName || 'Citizen'} Dashboard
                    </li>
                    {citizenLinks}
                </ul>
            </div>
        </div>
    );
};

export default CitizenDashboard;