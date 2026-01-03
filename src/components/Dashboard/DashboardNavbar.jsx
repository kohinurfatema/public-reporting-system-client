// src/components/Dashboard/DashboardNavbar.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaHome, FaUserCircle, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const DashboardNavbar = ({ role, dashboardHomePath, profilePath, drawerId }) => {
    const { user, logOut } = useAuth();

    const handleLogout = () => {
        logOut()
            .then(() => {
                // Logout successful
            })
            .catch((error) => {
                console.error('Logout error:', error);
            });
    };

    // Role badge colors
    const getRoleBadge = () => {
        switch (role) {
            case 'admin':
                return <span className="badge badge-primary badge-sm">Admin</span>;
            case 'staff':
                return <span className="badge badge-secondary badge-sm">Staff</span>;
            case 'citizen':
                return <span className="badge badge-accent badge-sm">Citizen</span>;
            default:
                return null;
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md border-b border-base-200 sticky top-0 z-40">
            {/* Left Side - Mobile Menu + Logo */}
            <div className="navbar-start">
                {/* Mobile Drawer Toggle */}
                <label
                    htmlFor={drawerId}
                    className="btn btn-ghost btn-circle drawer-button lg:hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </label>

                {/* Dashboard Logo/Title */}
                <Link
                    to={dashboardHomePath}
                    className="btn btn-ghost gap-2 text-xl font-bold normal-case"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </span>
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>

                {/* Role Badge */}
                <div className="ml-2 hidden md:block">{getRoleBadge()}</div>
            </div>

            {/* Center - Optional (can add breadcrumbs or page title here) */}
            <div className="navbar-center hidden lg:flex">
                <span className="text-sm text-base-content/60">
                    Welcome back, {user?.displayName || 'User'}!
                </span>
            </div>

            {/* Right Side - Profile Dropdown */}
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost gap-2"
                    >
                        <div className="avatar">
                            <div className="w-8 rounded-full ring-2 ring-primary/20">
                                <img
                                    alt="User Profile"
                                    src={
                                        user?.photoURL ||
                                        'https://placehold.co/100x100/94a3b8/ffffff?text=User'
                                    }
                                />
                            </div>
                        </div>
                        <span className="hidden sm:inline text-sm font-medium">
                            {user?.displayName?.split(' ')[0] || 'User'}
                        </span>
                        <FaChevronDown className="h-3 w-3 hidden sm:inline" />
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu dropdown-content mt-3 z-[100] p-2 shadow-lg bg-base-100 rounded-box w-56 border border-base-200"
                    >
                        {/* User Info Header */}
                        <li className="menu-title px-4 py-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold truncate">
                                    {user?.displayName || 'User'}
                                </span>
                                <span className="text-xs text-base-content/60 truncate">
                                    {user?.email}
                                </span>
                                <div className="mt-1">{getRoleBadge()}</div>
                            </div>
                        </li>

                        <div className="divider my-0"></div>

                        {/* Dashboard Home */}
                        <li>
                            <Link to={dashboardHomePath} className="flex items-center gap-2">
                                <FaHome className="h-4 w-4" />
                                Dashboard Home
                            </Link>
                        </li>

                        {/* Profile */}
                        <li>
                            <Link to={profilePath} className="flex items-center gap-2">
                                <FaUserCircle className="h-4 w-4" />
                                My Profile
                            </Link>
                        </li>

                        <div className="divider my-0"></div>

                        {/* Logout */}
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-error"
                            >
                                <FaSignOutAlt className="h-4 w-4" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;
