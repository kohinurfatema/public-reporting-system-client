// src/components/Home/LatestResolvedIssues.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import axios from 'axios';
import { FaMapMarkerAlt, FaCheckCircle, FaChevronUp, FaEye } from 'react-icons/fa';

const LatestResolvedIssues = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const { data: issues = [], isLoading, error } = useQuery({
        queryKey: ['latestResolvedIssues'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/issues/latest-resolved?limit=6`);
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Latest Resolved Issues</h2>
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Latest Resolved Issues</h2>
                <p className="text-center text-error">Failed to load issues. Please try again later.</p>
            </section>
        );
    }

    if (issues.length === 0) {
        return (
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Latest Resolved Issues</h2>
                <p className="text-center text-gray-500">No resolved issues yet. Be the first to report an issue!</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Resolved Issues</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    See how we're making a difference in your community. These issues have been successfully resolved thanks to citizen reports.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {issues.map((issue) => (
                    <div key={issue._id} className="card bg-gradient-to-br from-base-100 to-base-200 shadow-lg hover:shadow-2xl transition-all duration-300 border border-success/20 hover:border-success/50 overflow-hidden group">
                        {/* Image */}
                        <figure className="h-48 bg-gray-100 relative overflow-hidden">
                            {issue.imageUrl ? (
                                <img
                                    src={issue.imageUrl}
                                    alt={issue.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-success/10 to-emerald-500/10">
                                    <FaCheckCircle className="text-5xl text-success opacity-40" />
                                </div>
                            )}
                        </figure>

                        <div className="card-body p-5">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="badge badge-success text-white font-medium">
                                    <FaCheckCircle className="mr-1" /> Resolved
                                </span>
                                <span className="badge badge-outline">{issue.category}</span>
                                {issue.priority === 'High' && (
                                    <span className="badge badge-error text-white">High Priority</span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="card-title text-base font-bold line-clamp-2 mb-2">
                                {issue.title}
                            </h3>

                            {/* Location */}
                            <p className="text-sm text-base-content/60 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-error" />
                                <span className="line-clamp-1">{issue.location}</span>
                            </p>

                            {/* Footer */}
                            <div className="card-actions justify-between items-center mt-4 pt-3 border-t">
                                <div className="flex items-center gap-1 text-sm">
                                    <FaChevronUp className="text-primary" />
                                    <span className="font-medium">{issue.upvotes?.length || 0}</span>
                                </div>
                                <Link
                                    to={`/issue/${issue._id}`}
                                    className="btn btn-primary btn-sm"
                                >
                                    <FaEye /> View
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
                <Link to="/all-issues" className="btn btn-outline btn-primary btn-lg">
                    View All Issues
                </Link>
            </div>
        </section>
    );
};

export default LatestResolvedIssues;
