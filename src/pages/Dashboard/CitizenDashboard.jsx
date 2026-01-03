// src/pages/Dashboard/CitizenDashboard.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router';
import useAuth from '../../hooks/useAuth';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import { FaTachometerAlt, FaPlusCircle, FaClipboardList, FaUserCircle, FaHome } from 'react-icons/fa';

const CitizenDashboard = () => {
    const { user } = useAuth();

    // Define the sidebar links for the Citizen Role (using kebab-case paths)
    const citizenLinks = (
        <>
            <li>
                <NavLink to="/dashboard/citizen" end>
                    <FaTachometerAlt /> Dashboard Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/citizen/report-issue">
                    <FaPlusCircle /> Report New Issue
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/citizen/my-issues">
                    <FaClipboardList /> My Reported Issues
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/citizen/profile">
                    <FaUserCircle /> Profile & Subscription
                </NavLink>
            </li>
            <div className="divider">General</div>
            <li><NavLink to="/"><FaHome /> Home Page</NavLink></li>
        </>
    );

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* --- CONTENT AREA --- */}
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Dashboard Top Navbar */}
                <DashboardNavbar
                    role="citizen"
                    dashboardHomePath="/dashboard/citizen"
                    profilePath="/dashboard/citizen/profile"
                    drawerId="my-drawer-2"
                />

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