// src/pages/Static/Privacy.jsx

import React from 'react';
import { FaDatabase, FaCog, FaShieldAlt, FaShareAlt, FaUserCheck, FaCookie, FaEnvelope } from 'react-icons/fa';

const Privacy = () => {
    const sections = [
        {
            icon: <FaDatabase className="text-info" />,
            title: "Information We Collect",
            content: "We collect information you provide when creating an account, reporting issues, and using our services. This includes your name, email, and location data for reported issues.",
            color: "border-info"
        },
        {
            icon: <FaCog className="text-primary" />,
            title: "How We Use Your Information",
            content: "Your information is used to process issue reports, communicate updates, improve our services, and connect you with municipal authorities.",
            color: "border-primary"
        },
        {
            icon: <FaShieldAlt className="text-success" />,
            title: "Data Security",
            content: "We implement industry-standard security measures to protect your personal information. Your data is encrypted and stored securely.",
            color: "border-success"
        },
        {
            icon: <FaShareAlt className="text-warning" />,
            title: "Information Sharing",
            content: "We share issue reports with relevant municipal authorities for resolution. We do not sell your personal information to third parties.",
            color: "border-warning"
        },
        {
            icon: <FaUserCheck className="text-secondary" />,
            title: "Your Rights",
            content: "You have the right to access, update, or delete your personal information. Contact us to exercise these rights.",
            color: "border-secondary"
        },
        {
            icon: <FaCookie className="text-accent" />,
            title: "Cookies",
            content: "We use cookies to improve your experience and remember your preferences. You can disable cookies in your browser settings.",
            color: "border-accent"
        },
        {
            icon: <FaEnvelope className="text-error" />,
            title: "Contact Us",
            content: "For privacy concerns, email us at privacy@potholespatrols.com",
            color: "border-error"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-info via-primary to-secondary text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block mb-4">
                        <FaShieldAlt className="text-6xl opacity-80" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Privacy Policy</h1>
                    <p className="text-xl opacity-90 mb-2">Your privacy is important to us</p>
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mt-4">
                        <span className="font-semibold">Last updated: January 2025</span>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Intro Message */}
                    <div className="alert alert-success shadow-lg mb-8">
                        <FaShieldAlt className="text-2xl" />
                        <div>
                            <h3 className="font-bold">We respect your privacy</h3>
                            <div className="text-sm">We are committed to protecting your personal information and being transparent about how we use it.</div>
                        </div>
                    </div>

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
                    <div className="alert alert-warning mt-8 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>We may update this policy from time to time. Please review it periodically for changes.</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
