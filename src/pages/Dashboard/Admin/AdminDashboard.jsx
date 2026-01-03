// src/pages/Dashboard/Admin/AdminDashboard.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import DashboardNavbar from '../../../components/Dashboard/DashboardNavbar';
import { FaTachometerAlt, FaExclamationTriangle, FaUsers, FaUserTie, FaWallet, FaUserCircle, FaHome, FaGlobe } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useAuth();

    const adminLinks = (
        <>
            <li>
                <NavLink to="/dashboard/admin" end>
                    <FaTachometerAlt /> Dashboard Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/admin/all-issues">
                    <FaExclamationTriangle /> All Issues
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/admin/manage-users">
                    <FaUsers /> Manage Users
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/admin/manage-staff">
                    <FaUserTie /> Manage Staff
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/admin/payments">
                    <FaWallet /> Payments
                </NavLink>
            </li>
            <li>
                <NavLink to="/dashboard/admin/profile">
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
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

            {/* --- CONTENT AREA --- */}
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Dashboard Top Navbar */}
                <DashboardNavbar
                    role="admin"
                    dashboardHomePath="/dashboard/admin"
                    profilePath="/dashboard/admin/profile"
                    drawerId="admin-drawer"
                />

                {/* Main Content Area */}
                <div className="flex-1 p-4 md:p-8 w-full">
                    <Outlet />
                </div>
            </div>

            {/* --- Sidebar --- */}
            <div className="drawer-side z-50">
                <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl">
                    <li className="menu-title text-lg flex items-center gap-2">
                        <span className="badge badge-primary">Admin</span>
                        {user?.displayName || 'Admin'}
                    </li>
                    {adminLinks}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
