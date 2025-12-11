// src/pages/Dashboard/MyIssues.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
            setIsLoading(false);
            return;
        }

        const fetchMyIssues = async () => {
            try {
                setIsLoading(true);
                // Calls the new server endpoint: GET /issues/user/:email
                const res = await axiosSecure.get(`/issues/user/${user.email}`); 
                setIssues(res.data);
                
            } catch (err) {
                console.error("Failed to fetch user issues:", err);
                toast.error("Could not load your reported issues.");
                setIssues([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyIssues();
    }, [user, axiosSecure]);

    if (isLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span><p>Loading your reported issues...</p></div>;
    }

    // Function to map status to a DaisyUI badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return 'badge-info';
            case 'In-Progress':
            case 'Working':
                return 'badge-warning';
            case 'Resolved':
                return 'badge-success';
            case 'Closed':
                return 'badge-accent';
            case 'Rejected':
                return 'badge-error';
            default:
                return 'badge-secondary';
        }
    };

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">
                My Reported Issues ({issues.length})
            </h2>

            {issues.length === 0 ? (
                <div className="text-center py-10 bg-base-200 rounded-lg shadow-inner">
                    <p className="text-xl mb-4">You have not reported any issues yet!</p>
                    <Link to="/dashboard/citizen/report-issue" className="btn btn-primary">
                        Report Your First Issue
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full table-zebra shadow-xl">
                        {/* head */}
                        <thead>
                            <tr className='bg-primary text-white'>
                                <th>#</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Reported On</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue, index) => (
                                <tr key={issue._id}>
                                    <th>{index + 1}</th>
                                    <td>{issue.title}</td>
                                    <td>{issue.category}</td>
                                    <td>
                                        <div className={`badge ${getStatusBadge(issue.status)} text-white`}>
                                            {issue.status}
                                        </div>
                                    </td>
                                    <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {/* Placeholder for a future Issue Details page */}
                                        <Link 
                                            to={`/dashboard/citizen/issue-details/${issue._id}`} 
                                            className="btn btn-sm btn-outline btn-primary"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyIssues;