// src/routes/RoleRoute.jsx

import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate } from 'react-router';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading: authLoading } = useAuth();
    const { role: userRole, isLoading: roleLoading } = useUserRole();

    if (authLoading || roleLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace={true} />;
    }

    // Check if the user's role is in the list of allowed roles
    if (userRole && allowedRoles.includes(userRole)) {
        return children;
    }

    // Redirect based on actual role if access denied
    const redirectPath = userRole === 'admin'
        ? '/dashboard/admin'
        : userRole === 'staff'
            ? '/dashboard/staff'
            : '/dashboard/citizen';

    return <Navigate to={redirectPath} replace={true} />;
};

export default RoleRoute;
