// src/components/Home/CTASection.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaArrowRight, FaCrown } from 'react-icons/fa';

const CTASection = () => {
    return (
        <section className="py-16 container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Issue CTA */}
                <div className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-xl">
                    <div className="card-body p-8 md:p-12">
                        <h3 className="card-title text-2xl md:text-3xl font-bold mb-4">
                            See Something? Report It!
                        </h3>
                        <p className="mb-6 opacity-90">
                            Spotted a pothole, broken streetlight, or any infrastructure issue?
                            Report it now and help improve your community. It only takes 2 minutes!
                        </p>
                        <div className="card-actions">
                            <Link
                                to="/dashboard/citizen/report-issue"
                                className="btn btn-secondary btn-lg group"
                            >
                                Report an Issue
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Premium CTA */}
                <div className="card bg-gradient-to-br from-warning to-warning/80 text-warning-content shadow-xl">
                    <div className="card-body p-8 md:p-12">
                        <div className="flex items-center gap-2 mb-4">
                            <FaCrown className="text-3xl" />
                            <h3 className="card-title text-2xl md:text-3xl font-bold">
                                Go Premium
                            </h3>
                        </div>
                        <p className="mb-6 opacity-90">
                            Unlock unlimited issue reporting, priority support, and faster response times.
                            Join our premium community of active citizens today!
                        </p>
                        <ul className="mb-6 space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="badge badge-ghost">✓</span> Unlimited Reports
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="badge badge-ghost">✓</span> Priority Support
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="badge badge-ghost">✓</span> Premium Badge
                            </li>
                        </ul>
                        <div className="card-actions">
                            <Link
                                to="/dashboard/citizen/profile"
                                className="btn btn-neutral btn-lg group"
                            >
                                Subscribe Now - 1000৳
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
