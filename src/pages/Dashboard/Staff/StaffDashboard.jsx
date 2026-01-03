// src/pages/Dashboard/Staff/StaffDashboard.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import DashboardNavbar from '../../../components/Dashboard/DashboardNavbar';
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
                {/* Dashboard Top Navbar */}
                <DashboardNavbar
                    role="staff"
                    dashboardHomePath="/dashboard/staff"
                    profilePath="/dashboard/staff/profile"
                    drawerId="staff-drawer"
                />

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
