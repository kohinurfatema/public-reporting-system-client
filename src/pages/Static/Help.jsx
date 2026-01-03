// src/pages/Static/Help.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaBook, FaVideo, FaHeadset, FaComments } from 'react-icons/fa';

const resources = [
    { icon: FaBook, title: 'User Guide', desc: 'Step-by-step guide to using our platform', link: '/faq' },
    { icon: FaVideo, title: 'Video Tutorials', desc: 'Watch how to report and track issues', link: '#' },
    { icon: FaHeadset, title: 'Support', desc: 'Get help from our support team', link: '/contact' },
    { icon: FaComments, title: 'Community', desc: 'Join discussions with other citizens', link: '/all-issues' }
];

const Help = () => {
    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
                    <p className="text-xl opacity-90">Find answers and get support</p>
                </div>
            </section>
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {resources.map((r, i) => (
                            <Link key={i} to={r.link} className="card bg-base-200 hover:shadow-lg transition-shadow">
                                <div className="card-body items-center text-center">
                                    <r.icon className="text-4xl text-primary mb-4" />
                                    <h3 className="font-bold">{r.title}</h3>
                                    <p className="text-sm text-base-content/70">{r.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-16 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">Quick Start Guide</h2>
                        <div className="steps steps-vertical">
                            <div className="step step-primary">Create an account or login</div>
                            <div className="step step-primary">Navigate to your dashboard</div>
                            <div className="step step-primary">Click Report Issue</div>
                            <div className="step step-primary">Fill in details and submit</div>
                            <div className="step step-primary">Track progress in My Issues</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Help;
