// src/pages/Dashboard/Citizen/MyIssues.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

// Define the available categories and statuses for filters
const categories = [
    'Pothole',
    'Streetlight',
    'Water Leakage',
    'Garbage Overflow',
    'Damaged Footpath',
    'Other Infrastructure'
];
const statuses = ['Pending', 'In-Progress', 'Working', 'Resolved', 'Closed', 'Rejected'];

const MyIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null); // For the Edit Modal
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    // --- 1. Fetching Logic (with Filters) ---
    const fetchMyIssues = useCallback(async () => {
        if (!user?.email) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            
            // Build query parameters for filtering
            let query = '';
            if (filterStatus) {
                query += `&status=${filterStatus}`;
            }
            if (filterCategory) {
                query += `&category=${filterCategory}`;
            }
            // Remove leading '&' or '?' if present, and add base path
            const url = `/issues/user/${user.email}${query ? '?' + query.substring(1) : ''}`; 

            const res = await axiosSecure.get(url);
            setIssues(res.data);

        } catch (err) {
            console.error("Failed to fetch user issues:", err);
            toast.error("Could not load your reported issues.");
            setIssues([]);
        } finally {
            setIsLoading(false);
        }
    }, [user, axiosSecure, filterStatus, filterCategory]); // Depend on filters and user/axios

    useEffect(() => {
        fetchMyIssues();
    }, [fetchMyIssues]); 


    // --- 2. DELETE Logic ---
    const handleDeleteIssue = (id, title) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete the issue: "${title}"? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/issues/${id}`);
                    
                    if (res.data.message) {
                        toast.success(res.data.message);
                        // Update UI instantly by removing the deleted issue
                        setIssues(issues.filter(issue => issue._id !== id));
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Deletion failed.';
                    toast.error(errorMessage);
                }
            }
        });
    };

    // --- 3. EDIT Logic (Modal Handling) ---
    const handleEditClick = (issue) => {
        // Set the issue data to be edited
        setSelectedIssue(issue);
        // Pre-fill the form fields with existing data
        setValue('title', issue.title);
        setValue('description', issue.description);
        setValue('category', issue.category);
        setValue('location', issue.location);
        // Open the modal (assuming the modal has the id 'edit_issue_modal')
        document.getElementById('edit_issue_modal').showModal();
    };

    const handleEditSubmit = async (data) => {
        if (!selectedIssue) return;

        const toastId = toast.loading('Updating issue...');
        
        try {
            // NOTE: Add image upload logic here if you want to allow image updates
            
            const updatedIssueData = {
                title: data.title,
                description: data.description,
                category: data.category,
                location: data.location,
                // imageUrl: newImageUrl || selectedIssue.imageUrl, // Use new URL if uploaded
            };

            const res = await axiosSecure.patch(`/issues/${selectedIssue._id}`, updatedIssueData);
            
            toast.success('Issue updated successfully!', { id: toastId });
            
            // Update UI instantly: Replace the old issue object with the updated one
            setIssues(prevIssues => 
                prevIssues.map(issue => 
                    issue._id === selectedIssue._id ? res.data.issue : issue
                )
            );
            
            document.getElementById('edit_issue_modal').close();
            reset();

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Update failed.';
            toast.error(errorMessage, { id: toastId });
        }
    };


    // Helper function for status badge style
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

    if (isLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span><p>Loading your reported issues...</p></div>;
    }

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">
                My Reported Issues ({issues.length})
            </h2>

            {/* --- Filters Section --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center bg-base-200 p-4 rounded-lg shadow-md">
                <p className="font-semibold text-lg">Filters:</p>

                {/* Status Filter */}
                <select
                    className="select select-bordered w-full md:w-auto"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                {/* Category Filter */}
                <select
                    className="select select-bordered w-full md:w-auto"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                
                {/* Reset Button */}
                {(filterStatus || filterCategory) && (
                    <button 
                        className="btn btn-sm btn-outline btn-error w-full md:w-auto"
                        onClick={() => {
                            setFilterStatus('');
                            setFilterCategory('');
                        }}
                    >
                        Reset Filters
                    </button>
                )}
            </div>
            {/* --- End Filters Section --- */}


            {issues.length === 0 ? (
                <div className="text-center py-10 bg-base-200 rounded-lg shadow-inner">
                    <p className="text-xl mb-4">No issues found matching your filters.</p>
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
                                <th>Actions</th>
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
                                    <td className='flex gap-2'>
                                        {/* View Details Button */}
                                        <Link 
                                            to={`/dashboard/citizen/issue-details/${issue._id}`} 
                                            className="btn btn-sm btn-outline btn-primary"
                                        >
                                            View Details
                                        </Link>

                                        {/* Edit Button (Only if Pending) */}
                                        {issue.status === 'Pending' && (
                                            <button 
                                                className="btn btn-sm btn-warning"
                                                onClick={() => handleEditClick(issue)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        
                                        {/* Delete Button (Only if Pending) */}
                                        {issue.status === 'Pending' && (
                                            <button 
                                                className="btn btn-sm btn-error"
                                                onClick={() => handleDeleteIssue(issue._id, issue.title)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* --- Edit Issue Modal --- */}
            {/* The modal is defined outside the table loop */}
            <dialog id="edit_issue_modal" className="modal">
                <div className="modal-box w-11/12 max-w-2xl">
                    <h3 className="font-bold text-2xl text-warning mb-4">Edit Issue Details</h3>
                    <form onSubmit={handleSubmit(handleEditSubmit)}>
                        
                        {/* Title */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Issue Title</span></label>
                            <input
                                type="text"
                                className="input input-bordered"
                                {...register('title', { required: 'Title is required' })}
                            />
                            {errors.title && <p className="text-error mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Detailed Description</span></label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && <p className="text-error mt-1">{errors.description.message}</p>}
                        </div>

                        {/* Category */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Category</span></label>
                            <select
                                className="select select-bordered"
                                {...register('category', { required: 'Category is required' })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-error mt-1">{errors.category.message}</p>}
                        </div>

                        {/* Location */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Location / Address</span></label>
                            <input
                                type="text"
                                className="input input-bordered"
                                {...register('location', { required: 'Location is required' })}
                            />
                            {errors.location && <p className="text-error mt-1">{errors.location.message}</p>}
                        </div>

                        <div className="modal-action">
                            <button type="submit" className="btn btn-warning">Save Changes</button>
                            {/* Close button inside the form to close the modal */}
                            <button type="button" className="btn" onClick={() => document.getElementById('edit_issue_modal').close()}>Cancel</button>
                        </div>
                    </form>
                </div>
                {/* Close button outside the form for background click */}
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => {
                        setSelectedIssue(null); 
                        reset();
                    }}>close</button>
                </form>
            </dialog>
            {/* --- End Edit Issue Modal --- */}

        </div>
    );
};

export default MyIssues;