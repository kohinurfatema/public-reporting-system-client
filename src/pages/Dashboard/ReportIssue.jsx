// src/pages/Dashboard/ReportIssue.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
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
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-center text-primary mb-8">
                Report a New Infrastructure Issue
            </h2>

            {/* 💡 USER LIMIT WARNING AND BUTTON */}
            {isLimitReached && (
                <div role="alert" className="alert alert-warning mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.327L13.789 5.071a2 2 0 00-3.578 0L3.341 16.673A2 2 0 005.13 20z" /></svg>
                    <span>
                        Free user limit reached! You have reported {issueLimit} out of {MAX_FREE_ISSUES} issues.
                        Please subscribe to report unlimited issues.
                    </span>
                    {/* Link to Profile Page for subscription */}
                    <Link to="/dashboard/citizen/profile" className="btn btn-sm btn-warning">
                        Subscribe Now
                    </Link>
                </div>
            )}
            {/* END USER LIMIT WARNING */}

            <div className={`card w-full max-w-3xl mx-auto shadow-2xl bg-base-100 p-6 ${isLimitReached ? 'opacity-50 pointer-events-none' : ''}`}>
                <form onSubmit={handleSubmit(onSubmit)} className="card-body p-0">
                    
                    {/* 1. Title */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Issue Title</span></label>
                        <input
                            type="text"
                            placeholder="e.g., Large Pothole on Main Street"
                            className="input input-bordered"
                            maxLength={60}
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <p className="text-error mt-1">{errors.title.message}</p>}
                    </div>

                    {/* 2. Description */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Detailed Description</span></label>
                        <textarea
                            placeholder="Describe the issue, including landmarks or specific location details."
                            className="textarea textarea-bordered h-24"
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <p className="text-error mt-1">{errors.description.message}</p>}
                    </div>

                    {/* 3. Category & Location (Side-by-Side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Category Dropdown */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Category</span></label>
                            <select
                                className="select select-bordered"
                                defaultValue=""
                                {...register('category', { required: 'Category is required' })}
                            >
                                <option value="" disabled>Select Issue Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-error mt-1">{errors.category.message}</p>}
                        </div>

                        {/* Location */}
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Exact Location / Address</span></label>
                            <input
                                type="text"
                                placeholder="e.g., Intersection of 1st and Elm St."
                                className="input input-bordered"
                                {...register('location', { required: 'Location is required' })}
                            />
                            {errors.location && <p className="text-error mt-1">{errors.location.message}</p>}
                        </div>
                    </div>

                    {/* 4. Image Upload */}
                    <div className="form-control">
                        <label className="label"><span className="label-text font-semibold">Upload Image (Optional but recommended)</span></label>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered w-full"
                            {...register('image')}
                        />
                    </div>

                    {/* 5. Submit Button */}
                    <div className="form-control mt-6">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLimitReached || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Report"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIssue;