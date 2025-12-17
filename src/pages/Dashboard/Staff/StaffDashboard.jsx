// src/pages/Dashboard/Staff/StaffDashboard.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import { FaTachometerAlt, FaTasks, FaUserCircle, FaHome, FaGlobe } from 'react-icons/fa';

const StaffDashboard = () => {
    const { user } = useAuth();

    const staffLinks = (
        <>
            <li>
                <NavLink to="/dashboard/staff" end>
                    <FaTachometerAlt /> Dashboard Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/staff/assigned-issues">
                    <FaTasks /> Assigned Issues
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/staff/profile">
                    <FaUserCircle /> My Profile
                </NavLink>
            </li>
            <div className="divider">General</div>
            <li><NavLink to="/"><FaHome /> Home Page</NavLink></li>
            <li><NavLink to="/all-issues"><FaGlobe /> Public Issues</NavLink></li>
        </>
    );

    return (
        <div className="drawer lg:drawer-open">
            <input id="staff-drawer" type="checkbox" className="drawer-toggle" />

            {/* Content Area */}
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Mobile Menu Button */}
                <div className="sticky top-0 z-30 flex h-16 w-full items-center bg-base-200 bg-opacity-90 backdrop-blur lg:hidden px-4 shadow-sm">
                    <label htmlFor="staff-drawer" className="btn btn-ghost drawer-button gap-2">
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

            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="staff-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl">
                    <li className="menu-title text-lg flex items-center gap-2">
                        <span className="badge badge-secondary">Staff</span>
                        {user?.displayName || 'Staff Member'}
                    </li>
                    {staffLinks}
                </ul>
            </div>
        </div>
    );
};

export default StaffDashboard;
