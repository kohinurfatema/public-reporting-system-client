// src/pages/Dashboard/Citizen/MyIssues.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaEdit, FaMapMarkerAlt, FaList, FaExclamationCircle, FaRocket } from 'react-icons/fa';
import { MdTitle, MdDescription } from 'react-icons/md';
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
                return 'badge-neutral';
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
        <div className="p-2 md:p-4">
            <h2 className="text-2xl font-bold text-primary mb-6">
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
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                    <table className="table table-sm w-full">
                        {/* head */}
                        <thead>
                            <tr className='bg-primary text-white'>
                                <th className="text-center">#</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Reported On</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue, index) => (
                                <tr key={issue._id} className="hover:bg-base-200 transition-colors">
                                    <th className="text-center font-bold">{index + 1}</th>
                                    <td className="font-semibold text-base-content">
                                        <div className="max-w-[200px] truncate" title={issue.title}>
                                            {issue.title}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-outline badge-sm">
                                            {issue.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm ${getStatusBadge(issue.status)} text-white`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td>
                                        {issue.priority === 'High' ? (
                                            <span className="badge badge-sm badge-warning gap-1 font-semibold">
                                                <FaRocket className="text-xs" />
                                                Boosted
                                            </span>
                                        ) : (
                                            <span className="badge badge-sm badge-ghost">
                                                Normal
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap text-base-content">
                                        {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div className="flex gap-1 justify-center">
                                            {/* View Details Button */}
                                            <Link
                                                to={`/dashboard/citizen/issue-details/${issue._id}`}
                                                className="btn btn-xs btn-outline btn-info"
                                            >
                                                View
                                            </Link>

                                            {/* Edit Button (Only if Pending) */}
                                            {issue.status === 'Pending' && (
                                                <button
                                                    className="btn btn-xs btn-warning text-white"
                                                    onClick={() => handleEditClick(issue)}
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            {/* Delete Button (Only if Pending) */}
                                            {issue.status === 'Pending' && (
                                                <button
                                                    className="btn btn-xs btn-error text-white"
                                                    onClick={() => handleDeleteIssue(issue._id, issue.title)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* --- Edit Issue Modal --- */}
            <dialog id="edit_issue_modal" className="modal">
                <div className="modal-box w-11/12 max-w-3xl bg-base-100 shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-300">
                        <div className="p-3 bg-warning/20 rounded-full">
                            <FaEdit className="text-2xl text-warning" />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl text-warning">Edit Issue Details</h3>
                            <p className="text-sm text-base-content/60">Update your issue information below</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-5">

                        {/* Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <MdTitle className="text-primary text-xl" />
                                    Issue Title
                                    <span className="badge badge-error badge-xs">Required</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                className={`input input-bordered w-full ${errors.title ? 'input-error' : 'focus:input-primary'}`}
                                placeholder="Enter issue title"
                                {...register('title', { required: 'Title is required' })}
                            />
                            {errors.title && (
                                <label className="label">
                                    <span className="label-text-alt text-error flex items-center gap-1">
                                        <FaExclamationCircle />
                                        {errors.title.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <MdDescription className="text-primary text-xl" />
                                    Detailed Description
                                    <span className="badge badge-error badge-xs">Required</span>
                                </span>
                            </label>
                            <textarea
                                className={`textarea textarea-bordered h-28 w-full ${errors.description ? 'textarea-error' : 'focus:textarea-primary'}`}
                                placeholder="Describe the issue in detail..."
                                {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && (
                                <label className="label">
                                    <span className="label-text-alt text-error flex items-center gap-1">
                                        <FaExclamationCircle />
                                        {errors.description.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Category & Location Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Category */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold flex items-center gap-2">
                                        <FaList className="text-primary" />
                                        Category
                                        <span className="badge badge-error badge-xs">Required</span>
                                    </span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.category ? 'select-error' : 'focus:select-primary'}`}
                                    {...register('category', { required: 'Category is required' })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <label className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <FaExclamationCircle />
                                            {errors.category.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Location */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-primary" />
                                        Location / Address
                                        <span className="badge badge-error badge-xs">Required</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full ${errors.location ? 'input-error' : 'focus:input-primary'}`}
                                    placeholder="Enter exact location"
                                    {...register('location', { required: 'Location is required' })}
                                />
                                {errors.location && (
                                    <label className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <FaExclamationCircle />
                                            {errors.location.message}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="divider"></div>

                        {/* Action Buttons */}
                        <div className="modal-action mt-6">
                            <button
                                type="button"
                                className="btn btn-ghost gap-2"
                                onClick={() => {
                                    document.getElementById('edit_issue_modal').close();
                                    setSelectedIssue(null);
                                    reset();
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-warning gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Backdrop */}
                <form method="dialog" className="modal-backdrop bg-black/50">
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