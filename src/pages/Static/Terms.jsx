// src/pages/Static/Terms.jsx

import React from 'react';
import { FaCheckCircle, FaUserShield, FaExclamationTriangle, FaCopyright, FaServer, FaBalanceScale, FaSync } from 'react-icons/fa';

const Terms = () => {
    const sections = [
        {
            icon: <FaCheckCircle className="text-success" />,
            title: "Acceptance of Terms",
            content: "By accessing and using Potholes Patrols Report Hub, you agree to be bound by these Terms of Service.",
            color: "border-success"
        },
        {
            icon: <FaUserShield className="text-primary" />,
            title: "User Accounts",
            content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
            color: "border-primary"
        },
        {
            icon: <FaExclamationTriangle className="text-warning" />,
            title: "Acceptable Use",
            content: "You agree to use the platform only for legitimate infrastructure issue reporting. False reports or misuse may result in account suspension.",
            color: "border-warning"
        },
        {
            icon: <FaCopyright className="text-info" />,
            title: "Content Ownership",
            content: "You retain ownership of content you submit but grant us license to use it for service improvement and issue resolution.",
            color: "border-info"
        },
        {
            icon: <FaServer className="text-secondary" />,
            title: "Service Availability",
            content: "We strive to maintain service availability but do not guarantee uninterrupted access. Maintenance may occur periodically.",
            color: "border-secondary"
        },
        {
            icon: <FaBalanceScale className="text-error" />,
            title: "Limitation of Liability",
            content: "We are not liable for delays in issue resolution or actions taken by municipal authorities based on reports.",
            color: "border-error"
        },
        {
            icon: <FaSync className="text-accent" />,
            title: "Changes to Terms",
            content: "We may update these terms periodically. Continued use after changes constitutes acceptance of new terms.",
            color: "border-accent"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-secondary to-accent text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Terms of Service</h1>
                    <p className="text-xl opacity-90 mb-2">Last updated: January 2025</p>
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mt-4">
                        <span className="font-semibold">Please read carefully</span>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid gap-6">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className={`card bg-base-100 shadow-xl border-l-4 ${section.color} hover:shadow-2xl transition-shadow`}
                            >
                                <div className="card-body">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl mt-1">
                                            {section.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="card-title text-2xl mb-3">{section.title}</h2>
                                            <p className="text-base-content/70 leading-relaxed">{section.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Note */}
                    <div className="alert alert-info mt-8 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>By using our platform, you acknowledge that you have read and understood these terms.</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Terms;
