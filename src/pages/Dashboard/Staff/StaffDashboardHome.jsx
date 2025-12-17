// src/pages/Dashboard/Staff/StaffDashboardHome.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const StaffDashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['staffStats', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/staff/stats/${user?.email}`);
            return response.data;
        },
        enabled: !!user?.email
    });

    const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#6b7280'];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const statusData = stats?.statusDistribution
        ? Object.entries(stats.statusDistribution)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }))
        : [];

    const categoryData = stats?.categoryDistribution
        ? Object.entries(stats.categoryDistribution).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.displayName || 'Staff'}</h1>
                <p className="text-base-content/70">Here's your work overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat bg-base-100 rounded-box shadow">
                    <div className="stat-figure text-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div className="stat-title">Total Assigned</div>
                    <div className="stat-value text-primary">{stats?.totalAssigned || 0}</div>
                    <div className="stat-desc">Issues assigned to you</div>
                </div>

                <div className="stat bg-base-100 rounded-box shadow">
                    <div className="stat-figure text-warning">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="stat-title">Active Tasks</div>
                    <div className="stat-value text-warning">{stats?.todaysTasks || 0}</div>
                    <div className="stat-desc">Pending & In-Progress</div>
                </div>

                <div className="stat bg-base-100 rounded-box shadow">
                    <div className="stat-figure text-success">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="stat-title">Resolved</div>
                    <div className="stat-value text-success">{stats?.resolved || 0}</div>
                    <div className="stat-desc">Completed issues</div>
                </div>

                <div className="stat bg-base-100 rounded-box shadow">
                    <div className="stat-figure text-error">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="stat-title">High Priority</div>
                    <div className="stat-value text-error">{stats?.highPriority || 0}</div>
                    <div className="stat-desc">Boosted issues</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title">Status Distribution</h2>
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300} minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-base-content/50">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title">Issues by Category</h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300} minWidth={0}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-base-content/50">
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-gradient-to-r from-secondary to-primary text-primary-content shadow">
                <div className="card-body">
                    <h2 className="card-title">Quick Actions</h2>
                    <p>Manage your assigned issues efficiently</p>
                    <div className="card-actions justify-end">
                        <a href="/dashboard/staff/assigned-issues" className="btn btn-ghost">
                            View All Assigned Issues
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboardHome;
