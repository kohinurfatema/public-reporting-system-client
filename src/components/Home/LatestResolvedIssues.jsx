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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue) => (
                    <div key={issue._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200">
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
                                    <FaCheckCircle className="text-6xl text-success opacity-50" />
                                </div>
                            )}
                        </figure>

                        <div className="card-body p-5">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="badge badge-success text-white">
                                    <FaCheckCircle className="mr-1" /> Resolved
                                </span>
                                <span className="badge badge-outline">{issue.category}</span>
                                {issue.priority === 'High' && (
                                    <span className="badge badge-error text-white">High Priority</span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="card-title text-lg line-clamp-2">{issue.title}</h3>

                            {/* Location */}
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <FaMapMarkerAlt className="text-error" />
                                <span className="line-clamp-1">{issue.location}</span>
                            </p>

                            {/* Footer */}
                            <div className="card-actions justify-between items-center mt-4 pt-4 border-t">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <FaChevronUp className="text-primary" />
                                    <span>{issue.upvotes?.length || 0} upvotes</span>
                                </div>
                                <Link
                                    to={`/issue/${issue._id}`}
                                    className="btn btn-primary btn-sm"
                                >
                                    <FaEye /> View Details
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
