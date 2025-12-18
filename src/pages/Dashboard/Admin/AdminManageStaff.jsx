// src/pages/Dashboard/Admin/AdminManageStaff.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminManageStaff = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch staff
    const { data: staffList = [], isLoading } = useQuery({
        queryKey: ['staffList'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/staff');
            return res.data;
        }
    });

    // Create staff mutation
    const createMutation = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.post('/admin/staff', data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Staff member created successfully');
            queryClient.invalidateQueries({ queryKey: ['staffList'] });
            closeModal();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create staff');
        }
    });

    // Update staff mutation
    const updateMutation = useMutation({
        mutationFn: async ({ email, data }) => {
            const res = await axiosSecure.patch(`/admin/staff/${email}`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Staff member updated successfully');
            queryClient.invalidateQueries({ queryKey: ['staffList'] });
            closeModal();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update staff');
        }
    });

    // Delete staff mutation
    const deleteMutation = useMutation({
        mutationFn: async (email) => {
            const res = await axiosSecure.delete(`/admin/staff/${email}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Staff member deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['staffList'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete staff');
        }
    });

    const openAddModal = () => {
        setEditingStaff(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (staff) => {
        setEditingStaff(staff);
        setValue('name', staff.name);
        setValue('email', staff.email);
        setValue('phone', staff.phone || '');
        setValue('department', staff.department || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
        reset();
    };

    const handleDelete = (staff) => {
        Swal.fire({
            title: 'Delete Staff Member',
            text: `Are you sure you want to delete ${staff.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(staff.email);
            }
        });
    };

    const onSubmit = async (data) => {
        let photoURL = editingStaff?.photoURL || null;

        // Handle photo upload if provided
        if (data.photo && data.photo[0]) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('image', data.photo[0]);
                const imgRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                    formData
                );
                photoURL = imgRes.data.data.url;
            } catch (error) {
                toast.error('Failed to upload image');
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        const staffData = {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            department: data.department || 'General',
            photoURL,
            ...(data.password && { password: data.password }) // Include password only when creating
        };

        if (editingStaff) {
            updateMutation.mutate({ email: editingStaff.email, data: staffData });
        } else {
            createMutation.mutate(staffData);
        }
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Manage Staff</h1>
                <button onClick={openAddModal} className="btn btn-primary">
                    <FaPlus /> Add Staff
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Staff Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffList.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-base-200 rounded-xl">
                            <FaUserTie className="text-6xl text-gray-400 mx-auto mb-4" />
                            <p className="text-xl text-gray-500">No staff members yet</p>
                            <button onClick={openAddModal} className="btn btn-primary mt-4">
                                Add First Staff Member
                            </button>
                        </div>
                    ) : (
                        staffList.map((staff) => (
                            <div key={staff._id} className="card bg-base-100 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <div className="avatar">
                                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img
                                                src={staff.photoURL || 'https://placehold.co/100x100/94a3b8/ffffff?text=User'}
                                                alt={staff.name}
                                            />
                                        </div>
                                    </div>
                                    <h2 className="card-title mt-4">{staff.name}</h2>
                                    <p className="text-gray-500">{staff.email}</p>
                                    {staff.phone && (
                                        <p className="text-sm text-gray-400">{staff.phone}</p>
                                    )}
                                    <div className="badge badge-secondary mt-2">
                                        {staff.department || 'General'}
                                    </div>
                                    <div className="card-actions mt-4">
                                        <button
                                            onClick={() => openEditModal(staff)}
                                            className="btn btn-warning btn-sm"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(staff)}
                                            className="btn btn-error btn-sm"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name *</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="input input-bordered"
                                    placeholder="Enter name"
                                />
                                {errors.name && (
                                    <span className="text-error text-sm">{errors.name.message}</span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email *</span>
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="input input-bordered"
                                    placeholder="Enter email"
                                    disabled={!!editingStaff}
                                />
                                {errors.email && (
                                    <span className="text-error text-sm">{errors.email.message}</span>
                                )}
                            </div>

                            {!editingStaff && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password *</span>
                                    </label>
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: !editingStaff ? 'Password is required' : false,
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            }
                                        })}
                                        className="input input-bordered"
                                        placeholder="Enter password (min 6 characters)"
                                    />
                                    {errors.password && (
                                        <span className="text-error text-sm">{errors.password.message}</span>
                                    )}
                                    <span className="text-xs text-gray-500 mt-1">
                                        ⚠️ Admin will create Firebase Auth account with this password
                                    </span>
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Phone</span>
                                </label>
                                <input
                                    type="tel"
                                    {...register('phone')}
                                    className="input input-bordered"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Department</span>
                                </label>
                                <select
                                    {...register('department')}
                                    className="select select-bordered"
                                >
                                    <option value="General">General</option>
                                    <option value="Roads">Roads</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Water Supply">Water Supply</option>
                                    <option value="Sanitation">Sanitation</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Photo</span>
                                </label>
                                <input
                                    type="file"
                                    {...register('photo')}
                                    accept="image/*"
                                    className="file-input file-input-bordered"
                                />
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                                >
                                    {(createMutation.isPending || updateMutation.isPending || isUploading) && (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    )}
                                    {editingStaff ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}
        </div>
    );
};

export default AdminManageStaff;
