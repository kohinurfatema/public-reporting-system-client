// src/pages/Shared/Navbar/Navbar.jsx

import React from 'react';
import { NavLink, Link } from 'react-router';

const Navbar = () => {

    const navItems = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/all-issues">All Issues</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
            <li><NavLink to="/resources">Resources</NavLink></li>
        </>
    );

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
                
                {/* 🌟 IMPROVED LOGO SECTION (Option 3: Road & Alert) 🌟 */}
                <Link to="/" className="btn btn-ghost text-xl font-bold text-primary hover:bg-transparent">
                    {/* Icon: Road/Path + Alert */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 fill-current" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.327L13.789 5.071a2 2 0 00-3.578 0L3.341 16.673A2 2 0 005.13 20z" />
                    </svg>
                    <span className="hidden sm:inline">Pothole Patrol</span> 
                    <span className="sm:hidden">Patrol</span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>

            <div className="navbar-end">
                <div className="flex gap-2">
                    <Link to="/login" className="btn btn-ghost">
                        Login
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;