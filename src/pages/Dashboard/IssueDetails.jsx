// src/pages/Dashboard/Citizen/IssueDetails.jsx (UPDATED)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaInfoCircle, FaClock, FaUserTie, FaUserCog, FaTruckLoading, FaEdit, FaTrashAlt, FaChevronUp } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
// Import a modal component for editing (Placeholder for now)
// import EditIssueModal from './EditIssueModal'; 


const ISSUE_BOOST_PRICE = 100; // Define the boost price

const IssueDetails = () => {
    const { id } = useParams(); 
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    
    const [issue, setIssue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For editing

    const fetchIssueDetails = useCallback(async () => {
        if (!id || !user?.email) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await axiosSecure.get(`/issues/${id}`);
            setIssue(res.data);
        } catch (err) {
            console.error("Failed to fetch issue details:", err);
            toast.error("Could not load the issue details.");
            setIssue(null);
        } finally {
            setIsLoading(false);
        }
    }, [id, user, axiosSecure]);

    useEffect(() => {
        fetchIssueDetails();
    }, [fetchIssueDetails]);

    // --- Helper functions (same as before) ---
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'badge-info';
            case 'In-Progress':
            case 'Working': // Added Working status
                return 'badge-warning';
            case 'Resolved':
                return 'badge-success';
            case 'Rejected':
            case 'Closed': // Added Closed status
                return 'badge-error';
            default:
                return 'badge-neutral';
        }
    };
    
    // Check if the logged-in user is the original submitter
    const isSubmitter = issue && user?.email === issue.reporterEmail;
    
    // Check for button visibility
    const canEdit = isSubmitter && issue?.status === 'Pending';
    const canBoost = isSubmitter && issue?.priority !== 'High'; // Can boost if not already High

    // --- Handle Delete (Server-side deletion check is done in issueRoutes.js) ---
    const handleDelete = () => {
        if (!isSubmitter) {
            toast.error("You are not authorized to delete this issue.");
            return;
        }

        Swal.fire({
            title: 'Confirm Deletion',
            text: `Are you sure you want to delete "${issue.title}"? This is permanent.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const toastId = toast.loading('Deleting issue...');
                try {
                    await axiosSecure.delete(`/issues/${issue._id}`);
                    toast.success('Issue deleted successfully!', { id: toastId });
                    // Redirect back to My Issues page after successful deletion
                    navigate('/dashboard/citizen/my-issues'); 
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Deletion failed.';
                    toast.error(errorMessage, { id: toastId });
                }
            }
        });
    };
    
    // --- Handle Boost Logic (Placeholder for payment flow) ---
    const handleBoost = async () => {
        // --- 1. Initiate Payment (Stripe or similar flow would go here) ---
        // For now, we simulate success and move to the server update step.
        const confirmation = await Swal.fire({
            title: 'Confirm Boost Payment',
            text: `Do you confirm paying ${ISSUE_BOOST_PRICE}tk to boost this issue's priority to HIGH?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Pay and Boost!'
        });

        if (!confirmation.isConfirmed) return;

        // --- 2. Call Server Endpoint to Update Priority ---
        const toastId = toast.loading(`Boosting issue for ${ISSUE_BOOST_PRICE}tk...`);
        try {
            // NOTE: We need a new endpoint for boosting.
            // Example: PATCH /issues/boost/:id
            await axiosSecure.patch(`/issues/boost/${issue._id}`, { 
                amount: ISSUE_BOOST_PRICE,
                paymentMethod: 'Simulated' // Placeholder for real payment ID
            });

            toast.success('Issue priority successfully boosted!', { id: toastId });
            fetchIssueDetails(); // Refresh data to show new priority/timeline
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Boost failed. Check subscription/funds.';
            toast.error(errorMessage, { id: toastId });
        }
    };


    if (isLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span><p>Loading Issue #{id}...</p></div>;
    }

    if (!issue) {
        return <div className="text-center py-20 text-error">Issue not found or failed to load.</div>;
    }

    // You might want to prevent non-submitters from viewing the page, 
    // but typically security is handled by the RoleRoute, not this component.
    
    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-secondary mb-3">
                Issue Details: {issue.title}
            </h2>
            <div className="text-sm breadcrumbs mb-6">
                <ul>
                    <li><a href="/dashboard/citizen/my-issues">My Reported Issues</a></li> 
                    <li>Details</li>
                </ul>
            </div>
            
            {/* --- ACTION BUTTONS --- */}
            <div className="flex gap-4 mb-8 p-4 bg-base-200 rounded-lg shadow-md">
                {canEdit && (
                    <button 
                        className="btn btn-warning"
                        // onClick={() => setIsEditModalOpen(true)}
                    >
                        <FaEdit /> Edit Issue
                    </button>
                )}
                
                {isSubmitter && (
                    <button 
                        className={`btn btn-error text-white ${issue.status !== 'Pending' && 'btn-disabled'}`}
                        onClick={handleDelete}
                    >
                        <FaTrashAlt /> Delete Issue
                    </button>
                )}

                {canBoost && (
                    <button 
                        className="btn btn-success"
                        onClick={handleBoost}
                    >
                        <FaChevronUp /> Boost Priority ({ISSUE_BOOST_PRICE}tk)
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- 1. Main Content and Description --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card bg-base-100 shadow-xl p-6">
                        <h3 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                            <FaInfoCircle /> Report Overview
                        </h3>
                        
                        <p className="text-gray-600 mb-4">{issue.description}</p>
                        
                        {issue.imageUrl && (
                            <figure className="rounded-lg overflow-hidden mt-4">
                                <img 
                                    src={issue.imageUrl} 
                                    alt={`Image for ${issue.title}`} 
                                    className="max-h-96 w-full object-cover"
                                />
                            </figure>
                        )}
                    </div>

                    {/* --- STAFF INFORMATION --- */}
                    {issue.staffAssigned && (
                        <div className="card bg-success text-success-content shadow-xl p-6">
                            <h3 className="text-xl font-bold border-b border-white/50 pb-2 mb-4 flex items-center gap-2">
                                <FaUserCog /> Assigned Staff Information
                            </h3>
                            <p><strong>Staff Name:</strong> {issue.staffAssigned.name}</p>
                            <p><strong>Staff Email:</strong> {issue.staffAssigned.email}</p>
                            <p><strong>Department:</strong> {issue.staffAssigned.department || 'N/A'}</p>
                            <p className="mt-2 text-sm italic flex items-center gap-1"><FaTruckLoading/> Work may commence soon!</p>
                        </div>
                    )}
                </div>

                {/* --- 2. Side Panel / Metadata --- */}
                {/* --- 2. Side Panel / Metadata (IMPROVED DESIGN) --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card bg-base-100 shadow-xl p-6">
                        <h3 className="text-xl font-bold border-b pb-2 mb-4">Metadata</h3>
                        
                        <div className="space-y-4">
                            {/* Category */}
                            <div className="border-l-4 border-primary pl-3">
                                <p className="text-xs text-gray-500 uppercase">Category</p>
                                <p className="font-semibold text-base flex items-center gap-1">
                                    <FaTag className="text-primary"/> {issue.category}
                                </p>
                            </div>

                            {/* Priority */}
                            <div className="border-l-4 border-warning pl-3">
                                <p className="text-xs text-gray-500 uppercase">Priority</p>
                                <p className="font-semibold text-base flex items-center gap-1" style={{ color: issue.priority === 'High' ? 'red' : 'orange' }}>
                                    <FaTag /> {issue.priority}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="border-l-4 border-error pl-3">
                                <p className="text-xs text-gray-500 uppercase">Location</p>
                                <p className="font-semibold text-base flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-error"/> {issue.location}
                                </p>
                            </div>

                            {/* Reported Date */}
                            <div className="border-l-4 border-success pl-3">
                                <p className="text-xs text-gray-500 uppercase">Reported On</p>
                                <p className="font-semibold text-base flex items-center gap-1">
                                    <FaCalendarAlt className="text-success"/> {formatDateTime(issue.createdAt)}
                                </p>
                            </div>
                            
                            {/* Current Status */}
                            <div className="border-t pt-4 mt-4">
                                <p className="text-xs text-gray-500 uppercase mb-2">Current Status</p>
                                <span className={`badge badge-lg ${getStatusColor(issue.status)} text-white font-bold text-base`}>
                                    {issue.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* --- Boost Priority Button (Kept outside the Metadata box) --- */}
                    {canBoost && (
                        <div className="card bg-accent text-accent-content shadow-xl p-4 text-center">
                            <p className="font-bold mb-2">Want faster action?</p>
                            <button 
                                className="btn btn-warning btn-sm"
                                onClick={handleBoost}
                            >
                                <FaChevronUp /> Boost Priority ({ISSUE_BOOST_PRICE}tk)
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
           {/* --- 3. Timeline / Activity Tracking (IMPROVED DESIGN) --- */}
            <div className="mt-8 card bg-base-100 shadow-xl p-6">
                <h3 className="text-xl font-bold border-b pb-2 mb-6 flex items-center gap-2">
                    <FaClock /> Activity Timeline
                </h3>
                
                {issue.timeline && issue.timeline.length > 0 ? (
                    <div className="space-y-6">
                        {issue.timeline.map((event, index) => (
                            <div 
                                key={index} 
                                className={`border-l-4 p-4 rounded-r-lg shadow-sm 
                                    ${index === issue.timeline.length - 1 ? 'border-primary bg-primary/10' : 'border-gray-300 bg-base-200'}
                                `}
                            >
                                {/* Event Header: Date and Status */}
                                <div className="flex justify-between items-center mb-2 border-b border-gray-300/50 pb-1">
                                    <time className={`font-mono italic text-xs flex items-center gap-1 ${index === issue.timeline.length - 1 ? 'text-primary font-semibold' : 'text-gray-500'}`}>
                                        <FaCalendarAlt /> {formatDateTime(event.updatedAt)}
                                    </time>
                                    <span className={`font-bold ${getStatusColor(event.status)} badge text-white`}>
                                        {event.status}
                                    </span>
                                </div>
                                
                                {/* Event Message/Note */}
                                <p className="text-base font-medium mt-2">
                                    {event.message}
                                </p>
                                
                                {/* Updated By Information */}
                                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                                    <FaUserTie /> Updated By: 
                                    <span className="font-semibold ml-1">
                                        {event.updatedBy} ({event.updaterEmail})
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No activity history recorded.</p>
                )}
            </div>
        </div>
    );
};

export default IssueDetails;