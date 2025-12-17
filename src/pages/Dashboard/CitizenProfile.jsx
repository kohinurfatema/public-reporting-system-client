// src/pages/Dashboard/Citizen/CitizenProfile.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaUserCircle, FaEnvelope, FaTrophy, FaChartLine, FaExclamationCircle, FaLock, FaEdit, FaHistory } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import InvoiceDownloadButton from '../../components/Invoice/InvoicePDF';

const CitizenProfile = () => {
    const { user, setUser } = useAuth(); // Need setUser from context to update client-side name/photo
    const axiosSecure = useAxiosSecure();
    
    const [dbUserData, setDbUserData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const fetchUserData = useCallback(async () => {
        if (!user?.email) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const res = await axiosSecure.get(`/users/${user.email}`); 
            setDbUserData(res.data);
            
            // Set form default values for editing
            setValue('name', res.data.name);
            setValue('photoURL', res.data.photoURL || '');
            
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            toast.error("Could not load your detailed profile information.");
            setDbUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, [user, axiosSecure, setValue]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);


    // --- 1. Handle Profile Update ---
    const handleProfileUpdate = async (data) => {
        const toastId = toast.loading('Updating profile...');
        
        try {
            // NOTE: In a complete app, you would handle image upload here if needed.
            const res = await axiosSecure.patch(`/users/${user.email}`, data);
            
            // Update client-side state (MongoDB data)
            setDbUserData(res.data.user);
            
            // Update Firebase/Auth context user (name/photoURL)
            await user.updateProfile({ 
                displayName: res.data.user.name, 
                photoURL: res.data.user.photoURL 
            });
            setUser({ ...user, displayName: res.data.user.name, photoURL: res.data.user.photoURL });
            
            toast.success('Profile updated successfully!', { id: toastId });
            setIsEditing(false); // Close the edit mode

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Profile update failed.';
            toast.error(errorMessage, { id: toastId });
        }
    };

    // --- 2. Handle Subscription with Stripe Checkout ---
    const handleSubscribe = async () => {
        const SUBSCRIPTION_FEE = 1000;

        Swal.fire({
            title: 'Premium Subscription',
            text: `Pay ${SUBSCRIPTION_FEE} BDT via Stripe to unlock unlimited issue reporting.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#38bdf8',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Proceed to Payment'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const toastId = toast.loading('Redirecting to payment...');

                try {
                    // Create Stripe Checkout Session
                    const response = await axiosSecure.post('/payments/create-checkout-session', {
                        type: 'subscription'
                    });

                    toast.dismiss(toastId);

                    // Redirect to Stripe Checkout
                    if (response.data.url) {
                        window.location.href = response.data.url;
                    } else {
                        toast.error('Failed to create payment session');
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to initiate payment.';
                    toast.error(errorMessage, { id: toastId });
                }
            }
        });
    };


    if (isLoading) {
        return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span><p>Loading profile...</p></div>;
    }

    if (!dbUserData) {
        return <div className="text-center py-20 text-error">Could not retrieve profile data from the database.</div>;
    }

    const maxFreeIssues = 3; 

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-center text-secondary mb-8">
                Citizen Profile Overview
            </h2>

            <div className="card w-full max-w-3xl mx-auto bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                    
                    {/* --- HEADER: Photo & Edit Button --- */}
                    <div className="flex justify-between items-start mb-6">
                        <div className='flex items-center gap-4'>
                            {user.photoURL ? (
                                <img 
                                    src={user.photoURL} 
                                    alt={user.name || 'User'} 
                                    className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                                />
                            ) : (
                                <FaUserCircle className="w-24 h-24 text-gray-400" />
                            )}
                            <div className='text-lg'>
                                <p className="text-2xl font-bold flex items-center gap-2">
                                    {dbUserData.name}
                                    {dbUserData.isPremium && (
                                        <div className="badge badge-lg badge-warning text-white gap-2 ml-2">
                                            <FaTrophy /> PREMIUM
                                        </div>
                                    )}
                                </p>
                                <p className="text-sm text-gray-500">@{dbUserData.role}</p>
                            </div>
                        </div>

                        <button 
                            className="btn btn-sm btn-outline btn-primary"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <FaEdit /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* --- BLOCKED USER WARNING --- */}
                    {dbUserData.isBlocked && (
                        <div className="alert alert-error mb-6 shadow-lg">
                            <FaLock className='text-xl'/>
                            <span className='font-semibold'>ACCOUNT BLOCKED:</span>
                            <span>Your ability to report issues is suspended. Please contact the system authorities for assistance.</span>
                        </div>
                    )}


                    {/* --- PROFILE DISPLAY / EDIT FORM --- */}
                    <form onSubmit={handleSubmit(handleProfileUpdate)}>
                        
                        <div className='space-y-4'>
                            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                                <FaEnvelope className="text-primary text-xl" />
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold text-gray-500">Email Address (Read-only)</p>
                                    <p className="text-lg font-medium">{dbUserData.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                                <FaUserCircle className="text-primary text-xl" />
                                <div className="flex-grow">
                                    <label className="label p-0"><span className="text-sm font-semibold text-gray-500">Full Name</span></label>
                                    <input
                                        type="text"
                                        className={`input w-full p-0 text-lg font-medium bg-base-200 focus:outline-none ${isEditing ? 'border-b border-primary' : 'border-none'}`}
                                        readOnly={!isEditing}
                                        {...register('name', { required: 'Name is required' })}
                                    />
                                    {errors.name && <p className="text-error mt-1">{errors.name.message}</p>}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                                <div className="flex-grow">
                                    <label className="label p-0"><span className="text-sm font-semibold text-gray-500">Photo URL (Optional)</span></label>
                                    <input
                                        type="text"
                                        className={`input w-full p-0 text-md bg-base-200 focus:outline-none ${isEditing ? 'border-b border-primary' : 'border-none'}`}
                                        readOnly={!isEditing}
                                        {...register('photoURL')}
                                    />
                                </div>
                            </div>

                        </div>
                        
                        {isEditing && (
                            <div className="mt-6 flex justify-end">
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        )}
                    </form>

                    <div className="divider">Reporting Status</div>

                    {/* --- SUBSCRIPTION & LIMITS --- */}
                    <div className="space-y-4">
                        
                        {/* Issue Count and Limit Tracking */}
                        <div className="p-4 bg-info/10 border border-info rounded-lg">
                            <div className="flex items-center gap-4">
                                <FaExclamationCircle className="text-info text-3xl" />
                                <div>
                                    <p className="font-bold text-xl">Reports Filed: {dbUserData.issuesReportedCount}</p>
                                    {!dbUserData.isPremium && (
                                        <p className="text-sm">
                                            Remaining Reports: {Math.max(0, maxFreeIssues - dbUserData.issuesReportedCount)}
                                            {dbUserData.issuesReportedCount >= maxFreeIssues && (
                                                <span className="text-error font-semibold ml-2"> (Limit Reached)</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Subscription Card */}
                        {!dbUserData.isPremium && (
                            <div className='p-4 bg-yellow-50 border border-warning rounded-lg flex justify-between items-center'>
                                <div>
                                    <p className="font-bold text-xl text-warning">Upgrade to Premium</p>
                                    <p className="text-sm">Pay 1000tk for unlimited reporting access.</p>
                                </div>
                                <button
                                    className="btn btn-warning text-white"
                                    onClick={handleSubscribe}
                                    disabled={dbUserData.isBlocked}
                                >
                                    <FaTrophy /> Pay 1000tk
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="divider">Payment History</div>

                    {/* Payment History Section */}
                    <PaymentHistory userEmail={user?.email} axiosSecure={axiosSecure} />
                </div>
            </div>
        </div>
    );
};

// Payment History Component
const PaymentHistory = ({ userEmail, axiosSecure }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['userPayments', userEmail],
        queryFn: async () => {
            const response = await axiosSecure.get(`/payments/user/${userEmail}`);
            return response.data;
        },
        enabled: !!userEmail
    });

    const payments = data?.payments || [];

    if (isLoading) {
        return (
            <div className="text-center py-4">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="text-center py-4 text-base-content/50">
                <FaHistory className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No payment history yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {payments.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className={`badge ${payment.type === 'subscription' ? 'badge-success' : 'badge-warning'}`}>
                            {payment.type === 'subscription' ? 'Premium' : 'Boost'}
                        </div>
                        <div>
                            <p className="font-medium">{payment.amount} Tk</p>
                            <p className="text-xs text-base-content/60">
                                {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <InvoiceDownloadButton
                        invoice={{
                            transactionId: payment.transactionId,
                            date: payment.createdAt,
                            userName: payment.userName,
                            userEmail: payment.userEmail,
                            type: payment.type,
                            description: payment.type === 'boost'
                                ? `Priority Boost for Issue: ${payment.issueTitle || 'N/A'}`
                                : 'Premium Subscription',
                            amount: payment.amount
                        }}
                        className="btn btn-sm btn-outline btn-primary"
                    />
                </div>
            ))}
        </div>
    );
};

export default CitizenProfile;