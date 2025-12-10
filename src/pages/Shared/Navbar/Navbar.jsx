// src/pages/Shared/Navbar/Navbar.jsx

import React from 'react';
// 💡 IMPORTANT: Ensure NavLink and Link are imported from 'react-router-dom' 
// if you are using createBrowserRouter, as shown in the updated code below.
import { NavLink, Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
    // 💡 EXTRACTING USER AND LOGOUT FROM useAuth() HOOK
    const { user, logOut, loading } = useAuth();

    // --- TEMPORARY ROLE LOGIC ---
    // Since Firebase user object doesn't include the MongoDB role,
    // we assume 'citizen' for now. UPDATE THIS when you fetch the real role.
    const tempUserRole = 'citizen';
    // --- END TEMPORARY LOGIC ---

    const navItems = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/all-issues">All Issues</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
            <li><NavLink to="/resources">Resources</NavLink></li>
        </>
    );

    const handleDashboardClick = () => {
        // Determine the correct dashboard route based on the assumed/real role
        let dashboardPath = '/dashboard';
        if (tempUserRole === 'admin') dashboardPath = '/dashboard/admin';
        else if (tempUserRole === 'staff') dashboardPath = '/dashboard/staff';
        else if (tempUserRole === 'citizen') dashboardPath = '/dashboard/citizen';

        return dashboardPath;
    };

    // Optional: Show a simple spinner while checking auth status
    if (loading) {
        return <div className="navbar bg-base-100 shadow-md"><span className="loading loading-dots loading-md mx-auto"></span></div>;
    }

    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">

            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navItems}
                    </ul>
                </div>

                {/* 🌟 IMPROVED LOGO SECTION 🌟 */}
                <Link to="/" className="btn btn-ghost gap-3 text-xl font-black tracking-tight text-slate-900 hover:bg-transparent">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-200/60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.327L13.789 5.071a2 2 0 00-3.578 0L3.341 16.673A2 2 0 005.13 20z" />
                        </svg>
                    </span>
                    <div className="text-left">
                        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Potholes Pytrols</div>
                        <div className="text-lg leading-none">Report Hub</div>
                    </div>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>

            {/* 3. User Actions (End) - DYNAMIC LOGIN/PROFILE SECTION */}
            <div className="navbar-end">
                {user ? (
                    /* Logged In View: Profile Picture Dropdown */
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom" data-tip={user.displayName || user.email}>
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile"
                                    // Use user.photoURL if available, otherwise fallback to a default image
                                    src={user.photoURL || 'https://i.ibb.co/L8Gj18j/user-placeholder.jpg'}
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {/* User Name */}
                            <li className="menu-title">
                                <span className='text-md font-semibold text-neutral-content'>
                                    {user.displayName || "Citizen"}
                                </span>
                            </li>

                            {/* Dashboard Link */}
                            <li>
                                <Link to={handleDashboardClick()} className="justify-between">
                                    Dashboard
                                </Link>
                            </li>

                            {/* Logout Button */}
                            {/* 💡 IMPORTANT: Call the actual logOut function */}
                            <li><a onClick={logOut}>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    /* Logged Out View: Login and Registration Buttons */
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;