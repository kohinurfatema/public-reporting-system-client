// src/pages/Dashboard/ReportIssue.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import { FaMapMarkerAlt, FaImage, FaExclamationCircle, FaList } from 'react-icons/fa';
import { MdTitle, MdDescription } from 'react-icons/md';
import useAuth from '../../hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure';  // Make sure this hook exists
                                           

// Define the constant for free user limit
const MAX_FREE_ISSUES = 3;

const categories = [
    'Pothole',
    'Streetlight',
    'Water Leakage',
    'Garbage Overflow',
    'Damaged Footpath',
    'Other Infrastructure'
];

const ReportIssue = () => {
    const { user } = useAuth(); // Assuming useAuth provides the logged-in user object
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    // State for conditional rendering, initialized to loading/defaults
    const [issueLimit, setIssueLimit] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true); 
    
    // Logic for user limit check
    const isLimitReached = !isPremium && issueLimit >= MAX_FREE_ISSUES;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // 🎯 Step 1: Fetch User Status on Load for Limit Check
    useEffect(() => {
        if (!user?.email) {
            setIsLoadingStatus(false);
            return;
        }

        const fetchUserStatus = async () => {
            try {
                setIsLoadingStatus(true);
                // Calls your new GET /users/:email endpoint
                const res = await axiosSecure.get(`/users/${user.email}`); 
                
                // Update client state with server data
                setIssueLimit(res.data.issuesReportedCount);
                setIsPremium(res.data.isPremium);

            } catch (err) {
                console.error("Failed to fetch user status:", err);
                // If user is not found, assume default free status
                setIssueLimit(0);
                setIsPremium(false);
                toast.error("Failed to load user limits. Defaulting to free status.");
            } finally {
                setIsLoadingStatus(false);
            }
        };

        fetchUserStatus();
    }, [user, axiosSecure]); 

    // 💡 Real Image Upload using ImgBB
    const uploadImage = async (imageFile) => {
        if (!imageFile) return null;

        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                formData
            );
            return imgRes.data.data.url;
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image');
            return null;
        }
    };


    // 🎯 Step 2: Handle Form Submission
    const onSubmit = async (data) => {
        if (isLimitReached) {
            toast.error(`Issue limit reached. Please subscribe to Premium.`);
            return;
        }
        
        if (!user?.email) {
            toast.error("You must be logged in to report an issue.");
            return;
        }

        let imageUrl = null;
        const toastId = toast.loading('Uploading data and submitting report...');
        setIsSubmitting(true);

        try {
            // 1. Image Upload
            if (data.image && data.image[0]) {
                imageUrl = await uploadImage(data.image[0]);
            }

            // 2. Prepare the final issue data for the server (Matching server schema)
            const issueDataToSend = {
                reporterEmail: user.email, 
                title: data.title,
                description: data.description,
                category: data.category,
                location: data.location,
                imageUrl: imageUrl,
            };

            // 3. Send data to the backend API (POST /issues)
            // This calls the endpoint you just finished on the server!
            const response = await axiosSecure.post('/issues', issueDataToSend);
            
            toast.success(response.data.message || 'Issue successfully reported!', { id: toastId });
            reset(); // Clear the form
            
            // 4. Update the local count and navigate
            setIssueLimit(prev => prev + 1); // Optimistic update
            navigate('/dashboard/citizen/my-issues'); 

        } catch (error) {
            const serverMessage = error.response?.data?.message || 'Failed to report issue. Please try again.';
            
            // Handle the specific 403 limit error from the server
            if (error.response?.status === 403) {
                 toast.error(serverMessage); 
            } else {
                 toast.error(serverMessage, { id: toastId });
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isLoadingStatus) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span><p>Checking user subscription status and limits...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-primary rounded-full mb-4">
                        <FaExclamationCircle className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                        Report a New Infrastructure Issue
                    </h2>
                    <p className="text-base-content/70 text-sm md:text-base">
                        Help improve your community by reporting infrastructure problems
                    </p>
                </div>

                {/* User Status Badge */}
                {!isLimitReached && (
                    <div className="alert alert-info shadow-lg mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <div className="font-bold">
                                {isPremium ? 'Premium Account' : 'Free Account'}
                            </div>
                            <div className="text-xs">
                                {isPremium
                                    ? 'You can report unlimited issues'
                                    : `${issueLimit} of ${MAX_FREE_ISSUES} issues reported`
                                }
                            </div>
                        </div>
                    </div>
                )}

                {/* USER LIMIT WARNING */}
                {isLimitReached && (
                    <div role="alert" className="alert alert-warning mb-6 shadow-lg animate-pulse">
                        <FaExclamationCircle className="text-2xl" />
                        <div className="flex-1">
                            <h3 className="font-bold">Free Limit Reached!</h3>
                            <div className="text-xs">
                                You have reported {issueLimit} out of {MAX_FREE_ISSUES} issues.
                                Upgrade to Premium for unlimited reporting.
                            </div>
                        </div>
                        <Link to="/dashboard/citizen/profile" className="btn btn-sm btn-warning gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Upgrade Now
                        </Link>
                    </div>
                )}

                {/* Form Card */}
                <div className={`card bg-base-100 shadow-2xl ${isLimitReached ? 'opacity-60 pointer-events-none' : ''}`}>
                    <div className="card-body p-6 md:p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* 1. Title */}
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
                                    placeholder="e.g., Large Pothole on Main Street"
                                    className={`input input-bordered w-full ${errors.title ? 'input-error' : 'focus:input-primary'}`}
                                    maxLength={60}
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

                            {/* 2. Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold flex items-center gap-2">
                                        <MdDescription className="text-primary text-xl" />
                                        Detailed Description
                                        <span className="badge badge-error badge-xs">Required</span>
                                    </span>
                                </label>
                                <textarea
                                    placeholder="Describe the issue in detail, including any landmarks or specific location details that will help identify the problem..."
                                    className={`textarea textarea-bordered h-32 w-full ${errors.description ? 'textarea-error' : 'focus:textarea-primary'}`}
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

                            {/* 3. Category & Location (Side-by-Side) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Category Dropdown */}
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
                                        defaultValue=""
                                        {...register('category', { required: 'Category is required' })}
                                    >
                                        <option value="" disabled>Select Issue Category</option>
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
                                            Exact Location / Address
                                            <span className="badge badge-error badge-xs">Required</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Intersection of 1st and Elm St."
                                        className={`input input-bordered w-full ${errors.location ? 'input-error' : 'focus:input-primary'}`}
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

                            {/* 4. Image Upload */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold flex items-center gap-2">
                                        <FaImage className="text-primary" />
                                        Upload Image
                                        <span className="badge badge-info badge-xs">Optional</span>
                                    </span>
                                    <span className="label-text-alt text-base-content/60">
                                        Adding a photo helps staff assess the issue faster
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input file-input-bordered file-input-primary w-full"
                                    {...register('image')}
                                />
                            </div>

                            {/* Divider */}
                            <div className="divider"></div>

                            {/* 5. Submit Button */}
                            <div className="form-control">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-full gap-2"
                                    disabled={isLimitReached || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Submitting Report...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Submit Report
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Helper Text */}
                            <p className="text-center text-sm text-base-content/60">
                                Your report will be reviewed by our team within 24-48 hours
                            </p>
                        </form>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <Link to="/dashboard/citizen/my-issues" className="link link-primary">
                        View My Reported Issues
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReportIssue;