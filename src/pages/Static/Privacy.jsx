// src/pages/Static/Privacy.jsx

import React from 'react';

const Privacy = () => {
    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-xl opacity-90">Last updated: January 2025</p>
                </div>
            </section>
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4 max-w-3xl prose prose-lg">
                    <h2>Information We Collect</h2>
                    <p className="text-base-content/70">We collect information you provide when creating an account, reporting issues, and using our services. This includes your name, email, and location data for reported issues.</p>
                    
                    <h2>How We Use Your Information</h2>
                    <p className="text-base-content/70">Your information is used to process issue reports, communicate updates, improve our services, and connect you with municipal authorities.</p>
                    
                    <h2>Data Security</h2>
                    <p className="text-base-content/70">We implement industry-standard security measures to protect your personal information. Your data is encrypted and stored securely.</p>
                    
                    <h2>Information Sharing</h2>
                    <p className="text-base-content/70">We share issue reports with relevant municipal authorities for resolution. We do not sell your personal information to third parties.</p>
                    
                    <h2>Your Rights</h2>
                    <p className="text-base-content/70">You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
                    
                    <h2>Cookies</h2>
                    <p className="text-base-content/70">We use cookies to improve your experience and remember your preferences. You can disable cookies in your browser settings.</p>
                    
                    <h2>Contact Us</h2>
                    <p className="text-base-content/70">For privacy concerns, email us at privacy@potholespatrols.com</p>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
