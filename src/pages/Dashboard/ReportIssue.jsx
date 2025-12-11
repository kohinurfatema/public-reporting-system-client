// src/pages/Dashboard/ReportIssue.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'; 
import { useNavigate, Link } from 'react-router';
import useAuth from '../../hooks/useAuth';

// import useAxiosSecure from '../../../hooks/useAxiosSecure'; // You will need this for the real API call

// --- MOCK DATA: REPLACE THIS WITH REAL DATA FETCH ---
// In a real application, you must fetch the user's real subscription status 
// and issuesReported count from your MongoDB database upon component mount.
const mockUserData = {
    isPremium: false, // Set to true to test unlimited reporting
    issuesReported: 2, // Set to 3 or more to test the limit warning
    MAX_FREE_ISSUES: 3
};
// --- END MOCK DATA ---

const categories = [
    'Pothole',
    'Streetlight',
    'Water Leakage',
    'Garbage Overflow',
    'Damaged Footpath',
    'Other Infrastructure'
];

const ReportIssue = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    // const axiosSecure = useAxiosSecure(); // For server communication

    // State for conditional rendering
    const [issueLimit, setIssueLimit] = useState(mockUserData.issuesReported);
    const [isPremium, setIsPremium] = useState(mockUserData.isPremium);
    
    // Logic for user limit check
    const isLimitReached = !isPremium && issueLimit >= mockUserData.MAX_FREE_ISSUES;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // 💡 TODO: Add a useEffect hook here to fetch the REAL user data 
    // (subscription status and issuesReported count) from your backend.

    // 💡 Image Upload Function (Needs implementation - e.g., ImgBB, Cloudinary)
    const uploadImage = async (imageFile) => {
        // This is a placeholder for your actual ImgBB/Cloudinary upload logic.
        if (!imageFile) return null;
        
        console.log("Mocking image upload for:", imageFile.name);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        return `https://mock-image-url.com/${imageFile.name.substring(0, 10)}`;
    };


    const onSubmit = async (data) => {
        if (isLimitReached) {
            toast.error("Issue limit reached. Please subscribe to Premium.");
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

            // 2. Prepare the final issue data
            const newIssue = {
                reporterEmail: user.email, 
                title: data.title,
                description: data.description,
                category: data.category,
                location: data.location,
                imageUrl: imageUrl,
                // Server must handle creation of initial status (Pending) and timeline.
            };

            // 3. Send data to the backend API (e.g., /issues)
            // const response = await axiosSecure.post('/issues', newIssue);
            
            // --- MOCK BACKEND CALL ---
            await new Promise(resolve => setTimeout(resolve, 1000));
            // --- END MOCK ---


            toast.success('Issue successfully reported! Tracking started.', { id: toastId });
            reset(); // Clear the form
            
            // Navigate to the My Issues page using the kebab-case path
            navigate('/dashboard/citizen/my-issues'); 

        } catch (error) {
            console.error("Submission Error:", error);
            const errorMessage = error.response?.data?.message || 'Failed to report issue. Please try again.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };


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
                        Free user limit reached! You have reported {issueLimit} out of {mockUserData.MAX_FREE_ISSUES} issues.
                        Please subscribe to report unlimited issues.
                    </span>
                    {/* Link to Profile Page using the kebab-case path */}
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