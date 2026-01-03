// src/pages/IssueDetailsPublic.jsx - Public Issue Details Page

import React from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaChevronUp, FaArrowLeft } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const IssueDetailsPublic = () => {
    const { id } = useParams();

    const { data: issue, isLoading, error } = useQuery({
        queryKey: ['publicIssue', id],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/issues/${id}`);
            return res.data;
        }
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'badge-info';
            case 'In-Progress':
            case 'Working': return 'badge-warning';
            case 'Resolved': return 'badge-success';
            case 'Closed': return 'badge-neutral';
            case 'Rejected': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="mt-4">Loading issue details...</p>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <p className="text-error text-xl">Issue not found</p>
                <Link to="/all-issues" className="btn btn-primary mt-4">
                    <FaArrowLeft /> Back to All Issues
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link to="/all-issues" className="btn btn-ghost mb-4">
                <FaArrowLeft /> Back to All Issues
            </Link>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow-xl">
                        {/* Priority Banner */}
                        {issue.priority === 'High' && (
                            <div className="bg-error text-error-content text-center py-2 font-bold">
                                HIGH PRIORITY ISSUE
                            </div>
                        )}

                        {/* Image */}
                        {issue.imageUrl && (
                            <figure>
                                <img
                                    src={issue.imageUrl}
                                    alt={issue.title}
                                    className="w-full max-h-96 object-cover"
                                />
                            </figure>
                        )}

                        <div className="card-body p-8">
                            {/* Title */}
                            <h1 className="text-4xl font-bold mb-6 text-gray-800">{issue.title}</h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className={`badge badge-lg ${getStatusBadge(issue.status)} text-white font-semibold`}>
                                    {issue.status}
                                </span>
                                <span className="badge badge-lg badge-outline font-semibold">{issue.category}</span>
                                {issue.priority === 'High' && (
                                    <span className="badge badge-lg badge-error text-white font-semibold">High Priority</span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-base-200 rounded-lg p-6 mb-6">
                                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded"></span>
                                    Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{issue.description}</p>
                            </div>

                            {/* Upvotes */}
                            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-4 w-fit">
                                <FaChevronUp className="text-primary text-xl" />
                                <span className="font-bold text-lg">{issue.upvotes?.length || 0}</span>
                                <span className="text-gray-600">upvotes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Metadata */}
                <div className="lg:col-span-1">
                    <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border border-base-300">
                        <div className="card-body p-6">
                            <h3 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-primary">Issue Information</h3>

                            {/* Category */}
                            <div className="mb-5 bg-base-100 rounded-lg p-4 border-l-4 border-primary">
                                <p className="text-xs font-semibold text-primary uppercase mb-2 tracking-wider">Category</p>
                                <p className="font-bold text-lg flex items-center gap-2">
                                    <FaTag className="text-primary" />
                                    {issue.category}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="mb-5 bg-base-100 rounded-lg p-4 border-l-4 border-error">
                                <p className="text-xs font-semibold text-error uppercase mb-2 tracking-wider">Location</p>
                                <p className="font-bold text-base flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-error mt-1 flex-shrink-0" />
                                    <span>{issue.location}</span>
                                </p>
                            </div>

                            {/* Reported Date */}
                            <div className="mb-5 bg-base-100 rounded-lg p-4 border-l-4 border-success">
                                <p className="text-xs font-semibold text-success uppercase mb-2 tracking-wider">Reported On</p>
                                <p className="font-bold text-base flex items-center gap-2">
                                    <FaCalendarAlt className="text-success" />
                                    {formatDateTime(issue.createdAt)}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="bg-base-100 rounded-lg p-4 border-l-4 border-warning">
                                <p className="text-xs font-semibold text-warning uppercase mb-2 tracking-wider">Current Status</p>
                                <span className={`badge badge-lg ${getStatusBadge(issue.status)} text-white font-bold px-4 py-3`}>
                                    {issue.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div className="card bg-primary text-primary-content shadow-xl mt-4">
                        <div className="card-body text-center">
                            <h3 className="font-bold">Report an Issue</h3>
                            <p className="text-sm">See a problem in your community?</p>
                            <Link to="/register" className="btn btn-accent btn-sm mt-2">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailsPublic;
