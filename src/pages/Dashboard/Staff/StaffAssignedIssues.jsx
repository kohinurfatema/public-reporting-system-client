// src/pages/Dashboard/Staff/StaffAssignedIssues.jsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const StaffAssignedIssues = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        category: 'all'
    });
    const [page, setPage] = useState(1);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const limit = 10;

    const { data, isLoading, error } = useQuery({
        queryKey: ['staffIssues', user?.email, filters, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page,
                limit,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== 'all')
                )
            });
            const response = await axiosSecure.get(`/staff/issues/${user?.email}?${params}`);
            return response.data;
        },
        enabled: !!user?.email
    });

    const statusMutation = useMutation({
        mutationFn: async ({ issueId, status }) => {
            const response = await axiosSecure.patch(`/staff/issues/${issueId}/status`, {
                status,
                staffEmail: user?.email,
                staffName: user?.displayName
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Status updated successfully');
            queryClient.invalidateQueries({ queryKey: ['staffIssues'] });
            queryClient.invalidateQueries({ queryKey: ['staffStats'] });
            setSelectedIssue(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    });

    const issues = data?.issues || [];
    const totalPages = data?.totalPages || 1;

    const statusOptions = ['Pending', 'In-Progress', 'Working', 'Resolved', 'Closed'];
    const categories = ['Pothole', 'Streetlight', 'Water Leakage', 'Garbage', 'Road Damage', 'Other'];

    const getStatusBadge = (status) => {
        const badges = {
            'Pending': 'badge-warning',
            'In-Progress': 'badge-info',
            'Working': 'badge-primary',
            'Resolved': 'badge-success',
            'Closed': 'badge-ghost',
            'Rejected': 'badge-error'
        };
        return badges[status] || 'badge-ghost';
    };

    const getPriorityBadge = (priority) => {
        return priority === 'High' ? 'badge-error' : 'badge-ghost';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>Error loading issues: {error.message}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Assigned Issues</h1>
                <p className="text-base-content/70">Manage issues assigned to you</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select
                    className="select select-bordered select-sm"
                    value={filters.status}
                    onChange={(e) => {
                        setFilters(f => ({ ...f, status: e.target.value }));
                        setPage(1);
                    }}
                >
                    <option value="all">All Status</option>
                    {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="select select-bordered select-sm"
                    value={filters.priority}
                    onChange={(e) => {
                        setFilters(f => ({ ...f, priority: e.target.value }));
                        setPage(1);
                    }}
                >
                    <option value="all">All Priority</option>
                    <option value="High">High (Boosted)</option>
                    <option value="Normal">Normal</option>
                </select>

                <select
                    className="select select-bordered select-sm"
                    value={filters.category}
                    onChange={(e) => {
                        setFilters(f => ({ ...f, category: e.target.value }));
                        setPage(1);
                    }}
                >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Issues Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Issue</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.length > 0 ? (
                            issues.map((issue, index) => (
                                <tr key={issue._id} className={issue.priority === 'High' ? 'bg-error/5' : ''}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            {issue.image && (
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded">
                                                        <img src={issue.image} alt={issue.title} />
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium">{issue.title}</div>
                                                <div className="text-sm text-base-content/60">{issue.location}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{issue.category}</td>
                                    <td>
                                        <span className={`badge ${getPriorityBadge(issue.priority)}`}>
                                            {issue.priority}
                                            {issue.priority === 'High' && ' (Boosted)'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(issue.createdAt)}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => setSelectedIssue(issue)}
                                            >
                                                Update Status
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8">
                                    <div className="text-base-content/50">
                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <p>No issues assigned to you</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <div className="join">
                        <button
                            className="join-item btn"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <button
                                    key={pageNum}
                                    className={`join-item btn ${page === pageNum ? 'btn-active' : ''}`}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            className="join-item btn"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {selectedIssue && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Update Issue Status</h3>
                        <div className="py-4">
                            <div className="mb-4">
                                <p className="font-medium">{selectedIssue.title}</p>
                                <p className="text-sm text-base-content/60">{selectedIssue.location}</p>
                                <p className="text-sm mt-2">
                                    Current Status: <span className={`badge ${getStatusBadge(selectedIssue.status)}`}>{selectedIssue.status}</span>
                                </p>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Change Status To:</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {statusOptions.map(status => (
                                        <button
                                            key={status}
                                            className={`btn btn-sm ${selectedIssue.status === status ? 'btn-disabled' : 'btn-outline'}`}
                                            onClick={() => statusMutation.mutate({ issueId: selectedIssue._id, status })}
                                            disabled={statusMutation.isPending || selectedIssue.status === status}
                                        >
                                            {statusMutation.isPending ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                status
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Issue Details */}
                            <div className="mt-4 p-3 bg-base-200 rounded-lg">
                                <p className="text-sm"><strong>Category:</strong> {selectedIssue.category}</p>
                                <p className="text-sm"><strong>Priority:</strong> {selectedIssue.priority}</p>
                                <p className="text-sm"><strong>Submitted:</strong> {formatDate(selectedIssue.createdAt)}</p>
                                {selectedIssue.description && (
                                    <p className="text-sm mt-2"><strong>Description:</strong> {selectedIssue.description}</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setSelectedIssue(null)}>Close</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setSelectedIssue(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
};

export default StaffAssignedIssues;
