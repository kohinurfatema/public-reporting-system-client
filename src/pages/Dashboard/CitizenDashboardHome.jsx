// src/pages/Dashboard/Citizen/CitizenDashboardHome.jsx

import React, { useState, useEffect, useCallback } from 'react'; 
import toast from 'react-hot-toast';
import { FaExclamationCircle, FaHourglassHalf, FaTools, FaCheckCircle, FaWallet } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const COLORS = ['#38bdf8', '#fbbf24', '#10b981', '#ef4444']; // Info, Warning, Success, Error

// --- Card Component for Stats ---
const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className={`card shadow-lg ${colorClass} text-white`}>
        <div className="card-body p-4 items-center text-center">
            <Icon className="text-4xl mb-2" />
            <h2 className="card-title text-2xl font-bold">{value}</h2>
            <p className="text-sm">{title}</p>
        </div>
    </div>
);

const CitizenDashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({});
    const [dbUser, setDbUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user?.email) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            // Fetch 1: Dashboard Stats (GET /issues/stats/:email)
            const statsRes = await axiosSecure.get(`/issues/stats/${user.email}`);
            setStats(statsRes.data);

            // Fetch 2: User data (for payment/premium status)
            const userRes = await axiosSecure.get(`/users/${user.email}`);
            setDbUser(userRes.data);
            
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            toast.error("Could not load dashboard statistics.");
            setStats({});
        } finally {
            setIsLoading(false);
        }
    }, [user, axiosSecure]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span><p>Loading your dashboard stats...</p></div>;
    }
    
    // Prepare data for the Pie Chart
    const chartData = [
        { name: 'Pending', value: stats.totalPending || 0 },
        { name: 'In Progress', value: stats.totalInProgress || 0 },
        { name: 'Resolved', value: stats.totalResolved || 0 },
        // Calculate 'Other' category by subtracting tracked statuses from total submitted
        { name: 'Other/Total Submitted', value: stats.totalSubmitted - (stats.totalPending + stats.totalInProgress + stats.totalResolved) },
    ].filter(item => item.value > 0);
    
    // Simple check for subscription payment based on server logic
    const totalPayments = dbUser?.isPremium ? 1000 : 0; 

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-secondary mb-8">
                Welcome, {dbUser?.name || user?.displayName}!
            </h2>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                <StatCard 
                    title="Total Submitted" 
                    value={stats.totalSubmitted || 0} 
                    icon={FaExclamationCircle} 
                    colorClass="bg-primary" 
                />
                <StatCard 
                    title="Pending" 
                    value={stats.totalPending || 0} 
                    icon={FaHourglassHalf} 
                    colorClass="bg-info" 
                />
                <StatCard 
                    title="In Progress" 
                    value={stats.totalInProgress || 0} 
                    icon={FaTools} 
                    colorClass="bg-warning" 
                />
                <StatCard 
                    title="Resolved" 
                    value={stats.totalResolved || 0} 
                    icon={FaCheckCircle} 
                    colorClass="bg-success" 
                />
                <StatCard 
                    title="Total Payments (tk)" 
                    value={totalPayments} 
                    icon={FaWallet} 
                    colorClass="bg-accent" 
                />
            </div>

            {/* --- Chart Section --- */}
            <div className="bg-base-100 shadow-xl p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Issue Status Distribution</h3>
                
                {stats.totalSubmitted > 0 ? (
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-center py-10 text-lg text-gray-500">
                        Submit your first issue to see the breakdown chart!
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default CitizenDashboardHome;