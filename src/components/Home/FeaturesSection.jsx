// src/components/Home/FeaturesSection.jsx

import React from 'react';
import { FaMapMarkerAlt, FaBell, FaChartLine, FaUsers, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

const features = [
    {
        icon: FaMapMarkerAlt,
        title: 'Location-Based Reporting',
        description: 'Report issues with precise location details. Our system helps authorities locate and address problems quickly.',
        color: 'text-error',
        bgColor: 'bg-error/10',
        borderColor: 'border-error/30'
    },
    {
        icon: FaBell,
        title: 'Real-Time Updates',
        description: 'Get instant notifications when your reported issue status changes. Stay informed every step of the way.',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/30'
    },
    {
        icon: FaChartLine,
        title: 'Track Progress',
        description: 'Monitor the complete lifecycle of your report from submission to resolution with our detailed timeline.',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/30'
    },
    {
        icon: FaUsers,
        title: 'Community Engagement',
        description: 'Upvote important issues to prioritize them. Help your community by highlighting critical problems.',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/30'
    },
    {
        icon: FaShieldAlt,
        title: 'Verified Staff',
        description: 'Our trained municipal staff are assigned to handle issues professionally and efficiently.',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/30'
    },
    {
        icon: FaMobileAlt,
        title: 'Mobile Responsive',
        description: 'Report issues on-the-go from any device. Our platform works seamlessly on mobile, tablet, and desktop.',
        color: 'text-info',
        bgColor: 'bg-info/10',
        borderColor: 'border-info/30'
    }
];

const FeaturesSection = () => {
    return (
        <section className="bg-base-200 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We provide a comprehensive solution for citizens to report and track public infrastructure issues efficiently.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 ${feature.borderColor} ${feature.bgColor}`}
                        >
                            <div className="card-body items-center text-center p-6">
                                <div className={`p-5 rounded-2xl mb-4 ${feature.color} shadow-lg`} style={{background: `linear-gradient(135deg, rgba(var(--${feature.color.replace('text-', '')}-rgb, 0.15), rgba(var(--${feature.color.replace('text-', '')}-rgb, 0.05))`}}>
                                    <feature.icon className="text-5xl" />
                                </div>
                                <h3 className="card-title text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-base-content/70 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
