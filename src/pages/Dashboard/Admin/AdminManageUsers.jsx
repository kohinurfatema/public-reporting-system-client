// src/pages/Dashboard/Admin/AdminManageUsers.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaSearch, FaBan, FaUnlock, FaCrown } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    // Fetch users
    const { data, isLoading } = useQuery({
        queryKey: ['adminUsers', { search, page }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            params.append('page', page);
            params.append('limit', 10);

            const res = await axiosSecure.get(`/admin/users?${params.toString()}`);
            return res.data;
        }
    });

    // Block/Unblock mutation
    const blockMutation = useMutation({
        mutationFn: async ({ email, isBlocked }) => {
            const res = await axiosSecure.patch(`/admin/users/${email}/block`, { isBlocked });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    });

    const handleBlockToggle = (user) => {
        const action = user.isBlocked ? 'unblock' : 'block';
        Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            text: `Are you sure you want to ${action} ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: user.isBlocked ? '#10b981' : '#ef4444',
            confirmButtonText: `Yes, ${action}!`
        }).then((result) => {
            if (result.isConfirmed) {
                blockMutation.mutate({
                    email: user.email,
                    isBlocked: !user.isBlocked
                });
            }
        });
    };

    const users = data?.users || [];
    const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage Users</h1>

            {/* Search */}
            <div className="bg-base-200 rounded-xl p-4 mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="input input-bordered w-full pl-10"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Stats */}
            <div className="mb-4 text-gray-600">
                Total Citizens: {pagination.totalItems}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Users Table */}
            {!isLoading && (
                <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Issues Reported</th>
                                <th>Subscription</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className={user.isBlocked ? 'bg-error/10' : ''}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-12 rounded-full">
                                                        <img
                                                            src={user.photoURL || 'https://placehold.co/100x100/94a3b8/ffffff?text=User'}
                                                            alt={user.name}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="badge badge-ghost">
                                                {user.issuesReportedCount || 0} issues
                                            </span>
                                        </td>
                                        <td>
                                            {user.isPremium ? (
                                                <span className="badge badge-warning gap-1">
                                                    <FaCrown /> Premium
                                                </span>
                                            ) : (
                                                <span className="badge badge-ghost">Free</span>
                                            )}
                                        </td>
                                        <td>
                                            {user.isBlocked ? (
                                                <span className="badge badge-error">Blocked</span>
                                            ) : (
                                                <span className="badge badge-success">Active</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleBlockToggle(user)}
                                                disabled={blockMutation.isPending}
                                                className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-error'}`}
                                            >
                                                {user.isBlocked ? (
                                                    <><FaUnlock /> Unblock</>
                                                ) : (
                                                    <><FaBan /> Block</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="join">
                        <button
                            className="join-item btn"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            «
                        </button>
                        <button className="join-item btn">
                            Page {page} of {pagination.totalPages}
                        </button>
                        <button
                            className="join-item btn"
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManageUsers;
