// src/pages/Dashboard/Admin/AdminAllIssues.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaSearch, FaUserPlus, FaTimes, FaEye, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const categories = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage Overflow', 'Damaged Footpath', 'Other Infrastructure'];
const statuses = ['Pending', 'In-Progress', 'Working', 'Resolved', 'Closed', 'Rejected'];

const AdminAllIssues = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    // Fetch issues
    const { data, isLoading } = useQuery({
        queryKey: ['adminIssues', { search, status, category, page }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (status) params.append('status', status);
            if (category) params.append('category', category);
            params.append('page', page);
            params.append('limit', 10);

            const res = await axiosSecure.get(`/admin/issues?${params.toString()}`);
            return res.data;
        }
    });

    // Fetch staff list for assignment
    const { data: staffList = [] } = useQuery({
        queryKey: ['staffList'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/staff');
            return res.data;
        }
    });

    // Assign staff mutation
    const assignMutation = useMutation({
        mutationFn: async ({ issueId, staffEmail, staffName }) => {
            const res = await axiosSecure.patch(`/admin/issues/${issueId}/assign`, {
                staffEmail,
                staffName,
                adminEmail: user.email
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Staff assigned successfully');
            queryClient.invalidateQueries({ queryKey: ['adminIssues'] });
            setIsAssignModalOpen(false);
            setSelectedIssue(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to assign staff');
        }
    });

    // Reject issue mutation
    const rejectMutation = useMutation({
        mutationFn: async ({ issueId, reason }) => {
            const res = await axiosSecure.patch(`/admin/issues/${issueId}/reject`, {
                reason,
                adminEmail: user.email
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Issue rejected successfully');
            queryClient.invalidateQueries({ queryKey: ['adminIssues'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject issue');
        }
    });

    // Delete issue mutation
    const deleteMutation = useMutation({
        mutationFn: async (issueId) => {
            const res = await axiosSecure.delete(`/issues/${issueId}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Issue deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['adminIssues'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete issue');
        }
    });

    const handleAssign = (staffEmail) => {
        const staff = staffList.find(s => s.email === staffEmail);
        assignMutation.mutate({
            issueId: selectedIssue._id,
            staffEmail,
            staffName: staff?.name
        });
    };

    const handleReject = (issue) => {
        Swal.fire({
            title: 'Reject Issue',
            text: `Are you sure you want to reject "${issue.title}"?`,
            input: 'textarea',
            inputPlaceholder: 'Enter rejection reason...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Reject Issue'
        }).then((result) => {
            if (result.isConfirmed) {
                rejectMutation.mutate({
                    issueId: issue._id,
                    reason: result.value || 'Rejected by admin'
                });
            }
        });
    };

    const handleDelete = (issue) => {
        Swal.fire({
            title: 'Delete Issue',
            text: `Are you sure you want to permanently delete "${issue.title}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(issue._id);
            }
        });
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'Pending': return 'badge-info';
            case 'In-Progress':
            case 'Working': return 'badge-warning';
            case 'Resolved': return 'badge-success';
            case 'Rejected': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    const issues = data?.issues || [];
    const pagination = data?.pagination || { currentPage: 1, totalPages: 1 };

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage All Issues</h1>

            {/* Filters */}
            <div className="bg-base-200 rounded-xl p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-grow min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="input input-bordered w-full pl-10"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="select select-bordered"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="select select-bordered"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Issues Table */}
            {!isLoading && (
                <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        No issues found
                                    </td>
                                </tr>
                            ) : (
                                issues.map((issue) => (
                                    <tr key={issue._id} className={issue.priority === 'High' ? 'bg-error/10' : ''}>
                                        <td>
                                            <div className="max-w-[200px]">
                                                <p className="font-semibold truncate">{issue.title}</p>
                                                <p className="text-xs text-gray-500 truncate">{issue.reporterEmail}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">{issue.category}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(issue.status)}`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${issue.priority === 'High' ? 'badge-error' : 'badge-ghost'}`}>
                                                {issue.priority}
                                            </span>
                                        </td>
                                        <td>
                                            {issue.staffAssigned ? (
                                                <div className="text-sm">
                                                    <p className="font-medium">{issue.staffAssigned.name}</p>
                                                    <p className="text-xs text-gray-500">{issue.staffAssigned.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Not assigned</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <Link
                                                    to={`/dashboard/citizen/issue-details/${issue._id}`}
                                                    className="btn btn-ghost btn-xs"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </Link>

                                                {issue.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedIssue(issue);
                                                                setIsAssignModalOpen(true);
                                                            }}
                                                            className="btn btn-primary btn-xs"
                                                            title="Assign Staff"
                                                        >
                                                            <FaUserPlus />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(issue)}
                                                            className="btn btn-error btn-xs"
                                                            title="Reject"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}

                                                {(issue.status === 'In-Progress' || issue.status === 'Working') && !issue.staffAssigned && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedIssue(issue);
                                                            setIsAssignModalOpen(true);
                                                        }}
                                                        className="btn btn-primary btn-xs"
                                                        title="Assign Staff"
                                                    >
                                                        <FaUserPlus />
                                                    </button>
                                                )}

                                                {issue.status === 'Rejected' && (
                                                    <button
                                                        onClick={() => handleDelete(issue)}
                                                        className="btn btn-error btn-xs"
                                                        title="Delete Issue"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
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

            {/* Assign Staff Modal */}
            {isAssignModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Assign Staff to Issue</h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Assigning to: <strong>{selectedIssue?.title}</strong>
                        </p>

                        {staffList.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">
                                No staff members available. Please add staff first.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {staffList.map((staff) => (
                                    <div
                                        key={staff._id}
                                        className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer"
                                        onClick={() => handleAssign(staff.email)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 rounded-full">
                                                    <img src={staff.photoURL || 'https://placehold.co/100x100/94a3b8/ffffff?text=User'} alt="" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium">{staff.name}</p>
                                                <p className="text-xs text-gray-500">{staff.email}</p>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-sm">
                                            Assign
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => {
                                    setIsAssignModalOpen(false);
                                    setSelectedIssue(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setIsAssignModalOpen(false)}></div>
                </div>
            )}
        </div>
    );
};

export default AdminAllIssues;
