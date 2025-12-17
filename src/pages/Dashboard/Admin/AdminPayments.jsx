// src/pages/Dashboard/Admin/AdminPayments.jsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import InvoiceDownloadButton from '../../../components/Invoice/InvoicePDF';

const AdminPayments = () => {
    const axiosSecure = useAxiosSecure();
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, error } = useQuery({
        queryKey: ['adminPayments', filter, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page,
                limit,
                ...(filter !== 'all' && { type: filter })
            });
            const response = await axiosSecure.get(`/admin/payments?${params}`);
            return response.data;
        }
    });

    const payments = data?.payments || [];
    const totalPages = data?.totalPages || 1;
    const totalAmount = data?.totalAmount || 0;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeBadge = (type) => {
        const badges = {
            'boost': 'badge-warning',
            'subscription': 'badge-success'
        };
        return badges[type] || 'badge-ghost';
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
                <span>Error loading payments: {error.message}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Payment Management</h1>
                    <p className="text-base-content/70">View all payment transactions</p>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Revenue</div>
                        <div className="stat-value text-success">{totalAmount} Tk</div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                <select
                    className="select select-bordered"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="all">All Types</option>
                    <option value="boost">Boost Priority</option>
                    <option value="subscription">Premium Subscription</option>
                </select>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Reference</th>
                            <th>Date</th>
                            <th>Transaction ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((payment, index) => (
                                <tr key={payment._id}>
                                    <td>{(page - 1) * limit + index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 rounded-full">
                                                    <img
                                                        src={payment.userPhoto || 'https://via.placeholder.com/40'}
                                                        alt={payment.userName}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-medium">{payment.userName}</div>
                                                <div className="text-sm text-base-content/60">{payment.userEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${getTypeBadge(payment.type)}`}>
                                            {payment.type === 'boost' ? 'Priority Boost' : 'Premium Subscription'}
                                        </span>
                                    </td>
                                    <td className="font-semibold">{payment.amount} Tk</td>
                                    <td>
                                        {payment.type === 'boost' && payment.issueId ? (
                                            <span className="text-sm">Issue: {payment.issueId.slice(-6)}</span>
                                        ) : (
                                            <span className="text-base-content/50">-</span>
                                        )}
                                    </td>
                                    <td>{formatDate(payment.createdAt)}</td>
                                    <td>
                                        <span className="font-mono text-xs">{payment.transactionId || 'N/A'}</span>
                                    </td>
                                    <td>
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
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-8">
                                    <div className="text-base-content/50">
                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p>No payments found</p>
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                className={`join-item btn ${page === p ? 'btn-active' : ''}`}
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </button>
                        ))}
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
        </div>
    );
};

export default AdminPayments;
