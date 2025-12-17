// src/hooks/useUserRole.jsx

import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: userRole, isLoading, error } = useQuery({
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            if (!user?.email) return null;
            const response = await axiosSecure.get(`/users/${user.email}`);
            return response.data?.role || 'citizen';
        },
        enabled: !!user?.email && !authLoading,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    return {
        role: userRole || 'citizen',
        isLoading: authLoading || isLoading,
        error
    };
};

export default useUserRole;
