// src/pages/Dashboard/Admin/AdminDashboardHome.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaExclamationCircle, FaCheckCircle, FaUsers, FaWallet, FaUserTie, FaCrown, FaBan, FaHourglassHalf, FaTools, FaTimes } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6b7280'];

const StatCard = ({ title, value, icon: Icon, colorClass, linkTo }) => (
    <div className={`card shadow-lg ${colorClass} text-white`}>
        <div className="card-body p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-80">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                </div>
                <Icon className="text-4xl opacity-60" />
            </div>
            {linkTo && (
                <Link to={linkTo} className="btn btn-sm btn-ghost mt-2 text-white">
                    View Details →
                </Link>
            )}
        </div>
    </div>
);

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch admin stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/stats');
            return res.data;
        }
    });

    // Fetch latest data
    const { data: latest, isLoading: latestLoading } = useQuery({
        queryKey: ['adminLatest'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/latest');
            return res.data;
        }
    });

    if (statsLoading || latestLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const issueStats = stats?.issues || {};
    const userStats = stats?.users || {};

    // Prepare chart data
    const issueChartData = [
        { name: 'Pending', value: issueStats.pending || 0 },
        { name: 'In Progress', value: issueStats.inProgress || 0 },
        { name: 'Resolved', value: issueStats.resolved || 0 },
        { name: 'Rejected', value: issueStats.rejected || 0 },
        { name: 'Closed', value: issueStats.closed || 0 }
    ].filter(item => item.value > 0);

    const userChartData = [
        { name: 'Citizens', count: userStats.citizens || 0 },
        { name: 'Staff', count: userStats.staff || 0 },
        { name: 'Premium', count: userStats.premiumUsers || 0 },
        { name: 'Blocked', count: userStats.blockedUsers || 0 }
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Issues"
                    value={issueStats.totalIssues || 0}
                    icon={FaExclamationCircle}
                    colorClass="bg-primary"
                    linkTo="/dashboard/admin/issues"
                />
                <StatCard
                    title="Resolved"
                    value={issueStats.resolved || 0}
                    icon={FaCheckCircle}
                    colorClass="bg-success"
                />
                <StatCard
                    title="Total Users"
                    value={userStats.totalUsers || 0}
                    icon={FaUsers}
                    colorClass="bg-secondary"
                    linkTo="/dashboard/admin/users"
                />
                <StatCard
                    title="Total Payments"
                    value={`৳${stats?.totalPayments || 0}`}
                    icon={FaWallet}
                    colorClass="bg-accent"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-figure text-warning">
                        <FaHourglassHalf className="text-2xl" />
                    </div>
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-warning">{issueStats.pending || 0}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-figure text-info">
                        <FaTools className="text-2xl" />
                    </div>
                    <div className="stat-title">In Progress</div>
                    <div className="stat-value text-info">{issueStats.inProgress || 0}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-figure text-secondary">
                        <FaUserTie className="text-2xl" />
                    </div>
                    <div className="stat-title">Staff Members</div>
                    <div className="stat-value text-secondary">{userStats.staff || 0}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-lg">
                    <div className="stat-figure text-warning">
                        <FaCrown className="text-2xl" />
                    </div>
                    <div className="stat-title">Premium Users</div>
                    <div className="stat-value text-warning">{userStats.premiumUsers || 0}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issue Status Pie Chart */}
                <div className="card bg-base-100 shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Issues by Status</h3>
                    {issueChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300} minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={issueChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {issueChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-10">No issue data available</p>
                    )}
                </div>

                {/* User Stats Bar Chart */}
                <div className="card bg-base-100 shadow-xl p-6">
                    <h3 className="text-xl font-bold mb-4">User Statistics</h3>
                    <ResponsiveContainer width="100%" height={300} minWidth={0}>
                        <BarChart data={userChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Latest Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latest Issues */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">Latest Issues</h3>
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latest?.latestIssues?.map((issue) => (
                                        <tr key={issue._id}>
                                            <td className="max-w-[150px] truncate">{issue.title}</td>
                                            <td>
                                                <span className={`badge badge-sm ${issue.status === 'Pending' ? 'badge-info' :
                                                    issue.status === 'Resolved' ? 'badge-success' :
                                                        issue.status === 'Rejected' ? 'badge-error' : 'badge-warning'
                                                    }`}>
                                                    {issue.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm ${issue.priority === 'High' ? 'badge-error' : 'badge-ghost'}`}>
                                                    {issue.priority}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <Link to="/dashboard/admin/issues" className="btn btn-primary btn-sm">
                                View All Issues
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Latest Users */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title">Latest Registrations</h3>
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latest?.latestUsers?.map((user) => (
                                        <tr key={user._id}>
                                            <td className="flex items-center gap-2">
                                                <div className="avatar">
                                                    <div className="w-8 rounded-full">
                                                        <img src={user.photoURL || 'https://placehold.co/100x100/94a3b8/ffffff?text=User'} alt="" />
                                                    </div>
                                                </div>
                                                <span className="truncate max-w-[100px]">{user.name}</span>
                                            </td>
                                            <td className="max-w-[150px] truncate">{user.email}</td>
                                            <td>
                                                {user.isPremium && (
                                                    <span className="badge badge-warning badge-sm">Premium</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <Link to="/dashboard/admin/users" className="btn btn-primary btn-sm">
                                View All Users
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;
