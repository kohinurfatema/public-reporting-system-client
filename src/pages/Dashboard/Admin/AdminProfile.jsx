// src/pages/Dashboard/Admin/AdminProfile.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaUserShield, FaEnvelope, FaPhone, FaCalendar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminProfile = () => {
    const { user, setUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch admin profile from database
    const { data: profile, isLoading } = useQuery({
        queryKey: ['adminProfile', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/users/${user?.email}`);
            return response.data;
        },
        enabled: !!user?.email
    });

    // Fetch admin stats
    const { data: stats } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const response = await axiosSecure.get('/admin/stats');
            return response.data;
        }
    });

    // Update profile mutation
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axiosSecure.patch(`/users/${user?.email}`, data);
            return response.data;
        },
        onSuccess: async (data) => {
            toast.success('Profile updated successfully');
            queryClient.invalidateQueries({ queryKey: ['adminProfile'] });

            // Update Firebase user profile
            if (user?.updateProfile) {
                await user.updateProfile({
                    displayName: data.user?.name,
                    photoURL: data.user?.photoURL
                });
                setUser({ ...user, displayName: data.user?.name, photoURL: data.user?.photoURL });
            }

            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    });

    const onSubmit = (data) => {
        updateMutation.mutate({
            name: data.name,
            phone: data.phone,
            photoURL: data.photoURL
        });
    };

    const handleEditClick = () => {
        reset({
            name: profile?.name || '',
            phone: profile?.phone || '',
            photoURL: profile?.photoURL || ''
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        reset();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Admin Profile</h1>
                    <p className="text-base-content/70">View and manage your profile information</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={handleEditClick}>
                        <FaEdit /> Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row items-center gap-6 mb-6 pb-6 border-b">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img
                                            src={profile?.photoURL || user?.photoURL || 'https://placehold.co/128x128/94a3b8/ffffff?text=Admin'}
                                            alt={profile?.name}
                                        />
                                    </div>
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold">{profile?.name || user?.displayName}</h2>
                                    <p className="text-base-content/70">{profile?.email || user?.email}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                        <span className="badge badge-primary badge-lg gap-1">
                                            <FaUserShield /> Administrator
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form or Display */}
                            {isEditing ? (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                                            placeholder="Enter your full name"
                                            {...register('name', { required: 'Name is required' })}
                                        />
                                        {errors.name && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.name.message}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Phone Number</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="input input-bordered"
                                            placeholder="Enter your phone number"
                                            {...register('phone')}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Photo URL</span>
                                        </label>
                                        <input
                                            type="url"
                                            className="input input-bordered"
                                            placeholder="Enter photo URL"
                                            {...register('photoURL')}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Email Address</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="input input-bordered bg-base-200"
                                            value={profile?.email || user?.email}
                                            disabled
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-base-content/60">Email cannot be changed</span>
                                        </label>
                                    </div>

                                    <div className="flex gap-2 justify-end pt-4">
                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            onClick={handleCancelEdit}
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={updateMutation.isPending}
                                        >
                                            {updateMutation.isPending ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <>
                                                    <FaSave /> Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaUserShield className="text-primary text-xl" />
                                                <div>
                                                    <p className="text-sm text-base-content/60">Full Name</p>
                                                    <p className="font-semibold">{profile?.name || 'Not set'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaEnvelope className="text-primary text-xl" />
                                                <div>
                                                    <p className="text-sm text-base-content/60">Email Address</p>
                                                    <p className="font-semibold">{profile?.email || user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaPhone className="text-primary text-xl" />
                                                <div>
                                                    <p className="text-sm text-base-content/60">Phone Number</p>
                                                    <p className="font-semibold">{profile?.phone || 'Not set'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FaCalendar className="text-primary text-xl" />
                                                <div>
                                                    <p className="text-sm text-base-content/60">Member Since</p>
                                                    <p className="font-semibold">
                                                        {profile?.createdAt
                                                            ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">System Overview</h2>
                            <div className="space-y-4 mt-4">
                                <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                                    <span className="text-base-content/70">Total Issues</span>
                                    <span className="font-bold text-lg text-primary">
                                        {stats?.issues?.totalIssues || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                                    <span className="text-base-content/70">Resolved</span>
                                    <span className="font-bold text-lg text-success">
                                        {stats?.issues?.resolved || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                                    <span className="text-base-content/70">Pending</span>
                                    <span className="font-bold text-lg text-warning">
                                        {stats?.issues?.pending || 0}
                                    </span>
                                </div>

                                <div className="divider my-2"></div>

                                <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                                    <span className="text-base-content/70">Total Users</span>
                                    <span className="font-bold text-lg text-secondary">
                                        {stats?.users?.totalUsers || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-info/10 rounded-lg">
                                    <span className="text-base-content/70">Staff Members</span>
                                    <span className="font-bold text-lg text-info">
                                        {stats?.users?.staff || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                                    <span className="text-base-content/70">Total Payments</span>
                                    <span className="font-bold text-lg text-accent">
                                        ৳{stats?.totalPayments || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
