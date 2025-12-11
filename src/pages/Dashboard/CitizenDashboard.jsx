// src/pages/Dashboard/CitizenDashboard.jsx

import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth';

const CitizenDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Define the sidebar links for the Citizen Role (using kebab-case paths)
    const citizenLinks = (
        <>
            <li>
                <NavLink to="/dashboard/citizen" end>
                    Citizen Home
                </NavLink>
            </li>
            <li>
                {/* 🎯 Updated to use kebab-case path: report-issue */}
                <NavLink to="/dashboard/citizen/report-issue">
                    Report New Issue
                </NavLink>
            </li>
            <li>
                {/* 🎯 Updated to use kebab-case path: my-issues */}
                <NavLink to="/dashboard/citizen/my-issues">
                    My Reported Issues
                </NavLink>
            </li>
            <li>
                {/* 🎯 Updated to use kebab-case path: profile */}
                <NavLink to="/dashboard/citizen/profile">
                    Profile & Subscription
                </NavLink>
            </li>
            <div className="divider">General</div>
            <li><NavLink to="/">Home Page</NavLink></li>
        </>
    );
    
    // Determine if we are on a nested route (to avoid showing the dashboard as content)
    // If the path is exactly /dashboard/citizen, show an overview placeholder.
    // If it's a subpath, the Outlet will render the correct component.
    const isBaseCitizenPath = location.pathname === '/dashboard/citizen' || location.pathname === '/dashboard/citizen/';

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-start justify-start p-4 md:p-8">
                {/* The Outlet component renders the nested route elements (ReportIssue, MyIssues) 
                  IF they are defined as children of this route in router.jsx.
                */}
                <Outlet />
                
                {/* Fallback for the base path /dashboard/citizen */}
                {isBaseCitizenPath && (
                    <div className="py-10 px-6 w-full">
                        <h1 className="text-4xl font-bold">Welcome, {user?.displayName || 'Citizen'}!</h1>
                        <p className="mt-2 text-lg">Use the menu to the left to navigate your dashboard.</p>
                        {/* Placeholder for Citizen Overview/Stats */}
                    </div>
                )}
                
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden fixed bottom-4 right-4 z-40">
                    Menu
                </label>
            </div>
            
            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
                    {citizenLinks}
                </ul>
            </div>
        </div>
    );
};

export default CitizenDashboard;