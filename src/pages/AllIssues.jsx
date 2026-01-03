// src/pages/AllIssues.jsx

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaChevronUp, FaEye, FaSearch, FaFilter, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const categories = [
    'Pothole',
    'Streetlight',
    'Water Leakage',
    'Garbage Overflow',
    'Damaged Footpath',
    'Other Infrastructure'
];

const statuses = ['Pending', 'In-Progress', 'Working', 'Resolved', 'Closed', 'Rejected'];
const priorities = ['Normal', 'High'];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'mostUpvoted', label: 'Most Upvoted' },
    { value: 'priority', label: 'Priority (High to Normal)' }
];

const AllIssues = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Filter states
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const limit = 9;

    // Fetch issues with TanStack Query
    const { data, isLoading, error } = useQuery({
        queryKey: ['allIssues', { search, category, status, priority, page, limit }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            if (status) params.append('status', status);
            if (priority) params.append('priority', priority);
            params.append('page', page);
            params.append('limit', limit);

            const res = await axios.get(`${API_URL}/issues?${params.toString()}`);
            return res.data;
        }
    });

    // Upvote mutation
    const upvoteMutation = useMutation({
        mutationFn: async (issueId) => {
            const res = await axios.patch(`${API_URL}/issues/${issueId}/upvote`, {
                userEmail: user.email
            });
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['allIssues'] });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to upvote';
            toast.error(message);
        }
    });

    const handleUpvote = (issueId) => {
        if (!user) {
            toast.error('Please login to upvote');
            navigate('/login', { state: '/all-issues' });
            return;
        }
        upvoteMutation.mutate(issueId);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch('');
        setSearchInput('');
        setCategory('');
        setStatus('');
        setPriority('');
        setPage(1);
    };

    const hasActiveFilters = search || category || status || priority;

    // Status badge helper
    const getStatusBadge = (issueStatus) => {
        switch (issueStatus) {
            case 'Pending': return 'badge-info';
            case 'In-Progress':
            case 'Working': return 'badge-warning';
            case 'Resolved': return 'badge-success';
            case 'Closed': return 'badge-neutral';
            case 'Rejected': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    const rawIssues = data?.issues || [];
    const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

    // Sort issues based on selected sort option
    const issues = useMemo(() => {
        const sorted = [...rawIssues];

        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'mostUpvoted':
                return sorted.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
            case 'priority':
                return sorted.sort((a, b) => {
                    if (a.priority === 'High' && b.priority !== 'High') return -1;
                    if (a.priority !== 'High' && b.priority === 'High') return 1;
                    return 0;
                });
            default:
                return sorted;
        }
    }, [rawIssues, sortBy]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">All Reported Issues</h1>
                <p className="text-gray-600">
                    Browse and upvote issues in your community. Your voice matters!
                </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-base-200 rounded-xl p-4 mb-8">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by title, category, or location..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="input input-bordered w-full pl-10"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </form>

                {/* Filter and Sort Dropdowns */}
                <div className="flex flex-wrap gap-3 items-center">
                    <FaFilter className="text-gray-500" />

                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="select select-bordered select-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="select select-bordered select-sm"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <select
                        value={priority}
                        onChange={(e) => { setPriority(e.target.value); setPage(1); }}
                        className="select select-bordered select-sm"
                    >
                        <option value="">All Priorities</option>
                        {priorities.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>

                    <div className="divider divider-horizontal mx-0"></div>

                    <FaSortAmountDown className="text-gray-500" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="select select-bordered select-sm"
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="btn btn-ghost btn-sm text-error"
                        >
                            <FaTimes /> Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-gray-600">
                Showing {issues.length} of {pagination.totalItems} issues
                {hasActiveFilters && ' (filtered)'}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="alert alert-error mb-4">
                    <span>Failed to load issues. Please try again.</span>
                </div>
            )}

            {/* No Results */}
            {!isLoading && !error && issues.length === 0 && (
                <div className="text-center py-20 bg-base-200 rounded-xl">
                    <p className="text-xl text-gray-500 mb-4">No issues found</p>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="btn btn-primary">
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* Issues Grid */}
            {!isLoading && !error && issues.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {issues.map((issue) => (
                        <div
                            key={issue._id}
                            className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border ${issue.priority === 'High' ? 'border-error border-2' : 'border-base-200'
                                }`}
                        >
                            {/* Priority Banner */}
                            {issue.priority === 'High' && (
                                <div className="bg-error text-error-content text-center py-1 text-sm font-bold">
                                    HIGH PRIORITY - BOOSTED
                                </div>
                            )}

                            {/* Image */}
                            <figure className="h-48 bg-gray-200">
                                {issue.imageUrl ? (
                                    <img
                                        src={issue.imageUrl}
                                        alt={issue.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20">
                                        <span className="text-4xl opacity-30">📷</span>
                                    </div>
                                )}
                            </figure>

                            <div className="card-body p-5">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className={`badge ${getStatusBadge(issue.status)} text-white`}>
                                        {issue.status}
                                    </span>
                                    <span className="badge badge-outline">{issue.category}</span>
                                </div>

                                {/* Title */}
                                <h3 className="card-title text-lg line-clamp-2">{issue.title}</h3>

                                {/* Location */}
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-error flex-shrink-0" />
                                    <span className="line-clamp-1">{issue.location}</span>
                                </p>

                                {/* Footer */}
                                <div className="card-actions justify-between items-center mt-4 pt-4 border-t">
                                    {/* Upvote Button */}
                                    <button
                                        onClick={() => handleUpvote(issue._id)}
                                        disabled={upvoteMutation.isPending}
                                        className={`btn btn-sm gap-1 ${user && issue.upvotes?.includes(user.email)
                                                ? 'btn-primary'
                                                : 'btn-outline btn-primary'
                                            }`}
                                    >
                                        <FaChevronUp />
                                        <span>{issue.upvotes?.length || 0}</span>
                                    </button>

                                    {/* View Details */}
                                    <Link
                                        to={`/issue/${issue._id}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <FaEye /> Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <div className="join">
                        <button
                            className="join-item btn"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            «
                        </button>

                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`join-item btn ${page === i + 1 ? 'btn-active' : ''}`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

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

export default AllIssues;
