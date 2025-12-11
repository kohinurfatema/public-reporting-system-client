// src/routes/RoleRoute.jsx

import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading, userRole } = useAuth(); // Assume 'userRole' is provided by useAuth
    
    // 💡 NOTE: In a real app, userRole should be fetched from your database/JWT token
    // For now, we will use a mock role if user is logged in:
    const mockRole = user ? 'citizen' : null;
    const finalRole = userRole || mockRole; 

    if (loading) {
        // Show a loader while checking auth status
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (!user) {
        // If not logged in, PrivateRoute should already handle this, but checking again is safe.
        return <Navigate to="/login" replace={true} />;
    }

    // Check if the user's role is in the list of allowed roles
    if (user && finalRole && allowedRoles.includes(finalRole)) {
        return children;
    }

    // If logged in but role is not allowed (e.g., citizen trying to access /admin)
    // Redirect to a restricted access page or the general dashboard
    return (
        <div className="p-10 text-center">
            <h2 className="text-3xl font-bold text-error">Access Denied</h2>
            <p className="mt-4">You do not have the required permissions to view this page ({finalRole}).</p>
            <Navigate to="/dashboard/citizen" replace={true} />
        </div>
    );
};

export default RoleRoute;