// src/pages/Dashboard/Staff/StaffProfile.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const StaffProfile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['staffProfile', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/users/${user?.email}`);
            return response.data;
        },
        enabled: !!user?.email
    });

    const { data: stats } = useQuery({
        queryKey: ['staffStats', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/staff/stats/${user?.email}`);
            return response.data;
        },
        enabled: !!user?.email
    });

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axiosSecure.patch(`/users/${user?.email}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Profile updated successfully');
            queryClient.invalidateQueries({ queryKey: ['staffProfile'] });
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    });

    const onSubmit = (data) => {
        updateMutation.mutate({
            name: data.name,
            phone: data.phone
        });
    };

    const handleEditClick = () => {
        reset({
            name: profile?.name || '',
            phone: profile?.phone || ''
        });
        setIsEditing(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-base-content/70">View and manage your profile information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="avatar">
                                    <div className="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                                        <img
                                            src={profile?.photoURL || user?.photoURL || 'https://via.placeholder.com/96'}
                                            alt={profile?.name}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{profile?.name || user?.displayName}</h2>
                                    <p className="text-base-content/70">{profile?.email || user?.email}</p>
                                    <span className="badge badge-secondary mt-2">Staff Member</span>
                                </div>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
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
                                            <span className="label-text">Phone Number</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="input input-bordered"
                                            {...register('phone')}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="input input-bordered"
                                            value={profile?.email || user?.email}
                                            disabled
                                        />
                                        <label className="label">
                                            <span className="label-text-alt">Email cannot be changed</span>
                                        </label>
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={updateMutation.isPending}
                                        >
                                            {updateMutation.isPending ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-base-content/60">Full Name</p>
                                            <p className="font-medium">{profile?.name || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-base-content/60">Email</p>
                                            <p className="font-medium">{profile?.email || user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-base-content/60">Phone</p>
                                            <p className="font-medium">{profile?.phone || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-base-content/60">Role</p>
                                            <p className="font-medium capitalize">{profile?.role || 'Staff'}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button className="btn btn-primary" onClick={handleEditClick}>
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Work Statistics</h2>
                            <div className="space-y-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/70">Total Assigned</span>
                                    <span className="font-bold text-lg">{stats?.totalAssigned || 0}</span>
                                </div>
                                <div className="divider my-0"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/70">Resolved</span>
                                    <span className="font-bold text-lg text-success">{stats?.resolved || 0}</span>
                                </div>
                                <div className="divider my-0"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/70">In Progress</span>
                                    <span className="font-bold text-lg text-info">{stats?.inProgress || 0}</span>
                                </div>
                                <div className="divider my-0"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/70">Pending</span>
                                    <span className="font-bold text-lg text-warning">{stats?.pending || 0}</span>
                                </div>
                                <div className="divider my-0"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base-content/70">High Priority</span>
                                    <span className="font-bold text-lg text-error">{stats?.highPriority || 0}</span>
                                </div>
                            </div>

                            {stats?.totalAssigned > 0 && (
                                <div className="mt-6">
                                    <p className="text-sm text-base-content/60 mb-2">Resolution Rate</p>
                                    <progress
                                        className="progress progress-success w-full"
                                        value={stats?.resolved || 0}
                                        max={stats?.totalAssigned || 1}
                                    ></progress>
                                    <p className="text-right text-sm mt-1">
                                        {stats?.totalAssigned > 0
                                            ? Math.round((stats.resolved / stats.totalAssigned) * 100)
                                            : 0}%
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
