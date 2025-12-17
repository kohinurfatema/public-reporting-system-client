// src/components/Home/StatsSection.jsx

import React from 'react';
import { FaExclamationCircle, FaCheckCircle, FaUsers, FaClock } from 'react-icons/fa';

const stats = [
    {
        icon: FaExclamationCircle,
        value: '2,500+',
        label: 'Issues Reported',
        color: 'text-primary'
    },
    {
        icon: FaCheckCircle,
        value: '2,100+',
        label: 'Issues Resolved',
        color: 'text-success'
    },
    {
        icon: FaUsers,
        value: '5,000+',
        label: 'Active Citizens',
        color: 'text-secondary'
    },
    {
        icon: FaClock,
        value: '48 hrs',
        label: 'Avg. Response Time',
        color: 'text-warning'
    }
];

const StatsSection = () => {
    return (
        <section className="bg-gradient-to-r from-primary to-secondary py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact</h2>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        Together, we're making our city a better place to live. Here's what we've achieved so far.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="card bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                        >
                            <div className="card-body items-center text-center p-6">
                                <stat.icon className={`text-4xl mb-2 ${stat.color}`} />
                                <h3 className="text-3xl md:text-4xl font-bold">{stat.value}</h3>
                                <p className="text-white/80">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
