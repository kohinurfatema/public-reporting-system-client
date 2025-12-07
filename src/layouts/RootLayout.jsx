// src/layouts/RootLayout.jsx

import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Shared/Navbar/Navbar'; // Adjust path if needed


const RootLayout = () => {
    return (
        <div className='min-h-screen flex flex-col'>
            {/* The Navbar goes here */}
            <Navbar /> 
            
            {/* The content of the current route (Home, All Issues, etc.) renders here */}
            <main className='flex-grow container mx-auto px-4'>
                <Outlet />
            </main>

            {/* Footer will go here */}
            {/* <Footer /> */} 
        </div>
    );
};

export default RootLayout;