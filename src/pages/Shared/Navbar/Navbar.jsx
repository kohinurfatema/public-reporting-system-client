// src/pages/Shared/Navbar/Navbar.jsx

import React from 'react';
import { NavLink, Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useUserRole from '../../../hooks/useUserRole';
import ThemeToggle from '../../../components/ThemeToggle';
import { FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut, loading } = useAuth();
    const { role: userRole, isLoading: roleLoading } = useUserRole();

    const getDashboardPath = () => {
        if (userRole === 'admin') return '/dashboard/admin';
        if (userRole === 'staff') return '/dashboard/staff';
        return '/dashboard/citizen';
    };

    // Public nav items (minimum 3 for logged out)
    const publicNavItems = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>Home</NavLink></li>
            <li><NavLink to="/all-issues" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>All Issues</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>About</NavLink></li>
        </>
    );

    // Additional items for logged-in users (total minimum 5)
    const authNavItems = (
        <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>Home</NavLink></li>
            <li><NavLink to="/all-issues" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>All Issues</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>About</NavLink></li>
            <li>
                <details>
                    <summary className="flex items-center gap-1">
                        Resources <FaChevronDown className="h-3 w-3" />
                    </summary>
                    <ul className="p-2 bg-base-100 rounded-box w-52 shadow-xl border border-base-200">
                        <li className="menu-title">
                            <span className="text-xs font-semibold">Help & Support</span>
                        </li>
                        <li><NavLink to="/help">Help Center</NavLink></li>
                        <li><NavLink to="/faq">FAQ</NavLink></li>
                        <li><NavLink to="/contact">Contact Us</NavLink></li>
                        <div className="divider my-1"></div>
                        <li className="menu-title">
                            <span className="text-xs font-semibold">Legal & Policies</span>
                        </li>
                        <li><NavLink to="/terms">Terms of Service</NavLink></li>
                        <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
                    </ul>
                </details>
            </li>
            <li><NavLink to="/privacy" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>Privacy</NavLink></li>
        </>
    );

    const navItems = user ? authNavItems : publicNavItems;

    if (loading) {
        return (
            <div className="navbar bg-base-100 shadow-md">
                <span className="loading loading-dots loading-md mx-auto"></span>
            </div>
        );
    }

    return (
        <div className="navbar bg-base-100/95 backdrop-blur-md shadow-sm border-b border-base-200 sticky top-0 z-50">
            <div className="navbar-start">
                {/* Mobile Menu */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-lg bg-base-100 text-base-content rounded-box w-52">
                        {navItems}
                    </ul>
                </div>

                {/* Logo */}
                <Link to="/" className="btn btn-ghost gap-3 text-xl font-black tracking-tight hover:bg-transparent">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.327L13.789 5.071a2 2 0 00-3.578 0L3.341 16.673A2 2 0 005.13 20z" />
                        </svg>
                    </span>
                    <div className="text-left hidden sm:block">
                        <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Potholes Patrols</div>
                        <div className="text-lg leading-none font-bold text-base-content">Report Hub</div>
                    </div>
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {navItems}
                </ul>
            </div>

            {/* Right Side Actions */}
            <div className="navbar-end gap-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                {user ? (
                    /* Logged In: Profile Dropdown */
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-primary/20 hover:ring-primary/40">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Profile"
                                    src={user.photoURL || 'https://placehold.co/100x100/94a3b8/ffffff?text=User'}
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-lg bg-base-100 text-base-content rounded-box w-56">
                            <li className="menu-title px-4 py-2">
                                <span className="text-sm font-semibold truncate">
                                    {user.displayName || user.email}
                                </span>
                            </li>
                            <div className="divider my-0"></div>
                            <li>
                                <Link to={getDashboardPath()} className="flex justify-between">
                                    Dashboard
                                    {roleLoading && <span className="loading loading-spinner loading-xs"></span>}
                                </Link>
                            </li>
                            <li><Link to="/profile">Profile Settings</Link></li>
                            <div className="divider my-0"></div>
                            <li><button onClick={logOut} className="text-error">Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    /* Logged Out: Auth Buttons */
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost btn-sm">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary btn-sm">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
