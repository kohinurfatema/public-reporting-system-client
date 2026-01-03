// src/pages/Static/Terms.jsx

import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-xl opacity-90">Last updated: January 2025</p>
                </div>
            </section>
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4 max-w-3xl prose prose-lg">
                    <h2>Acceptance of Terms</h2>
                    <p className="text-base-content/70">By accessing and using Potholes Patrols Report Hub, you agree to be bound by these Terms of Service.</p>
                    
                    <h2>User Accounts</h2>
                    <p className="text-base-content/70">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                    
                    <h2>Acceptable Use</h2>
                    <p className="text-base-content/70">You agree to use the platform only for legitimate infrastructure issue reporting. False reports or misuse may result in account suspension.</p>
                    
                    <h2>Content Ownership</h2>
                    <p className="text-base-content/70">You retain ownership of content you submit but grant us license to use it for service improvement and issue resolution.</p>
                    
                    <h2>Service Availability</h2>
                    <p className="text-base-content/70">We strive to maintain service availability but do not guarantee uninterrupted access. Maintenance may occur periodically.</p>
                    
                    <h2>Limitation of Liability</h2>
                    <p className="text-base-content/70">We are not liable for delays in issue resolution or actions taken by municipal authorities based on reports.</p>
                    
                    <h2>Changes to Terms</h2>
                    <p className="text-base-content/70">We may update these terms periodically. Continued use after changes constitutes acceptance of new terms.</p>
                </div>
            </section>
        </div>
    );
};

export default Terms;
