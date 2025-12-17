// src/pages/Dashboard/Admin/AdminDashboard.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router';
import useAuth from '../../../hooks/useAuth';
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
                {/* Mobile Menu Button */}
                <div className="sticky top-0 z-30 flex h-16 w-full items-center bg-base-200 bg-opacity-90 backdrop-blur lg:hidden px-4 shadow-sm">
                    <label htmlFor="admin-drawer" className="btn btn-ghost drawer-button gap-2">
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
