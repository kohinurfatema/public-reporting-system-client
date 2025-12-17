// src/components/Home/HowItWorks.jsx

import React from 'react';
import { FaClipboardList, FaUserCheck, FaTools, FaCheckDouble } from 'react-icons/fa';

const steps = [
    {
        icon: FaClipboardList,
        step: '01',
        title: 'Report an Issue',
        description: 'Fill out a simple form with issue details, upload a photo, and mark the location. Your report is submitted instantly.',
        color: 'bg-primary'
    },
    {
        icon: FaUserCheck,
        step: '02',
        title: 'Admin Reviews',
        description: 'Our admin team reviews your report and assigns it to the appropriate municipal staff member.',
        color: 'bg-secondary'
    },
    {
        icon: FaTools,
        step: '03',
        title: 'Staff Takes Action',
        description: 'The assigned staff visits the location, verifies the issue, and begins repair work. You receive status updates.',
        color: 'bg-accent'
    },
    {
        icon: FaCheckDouble,
        step: '04',
        title: 'Issue Resolved',
        description: 'Once the work is complete, the issue is marked as resolved. You can verify and provide feedback.',
        color: 'bg-success'
    }
];

const HowItWorks = () => {
    return (
        <section className="py-16 container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Reporting and resolving infrastructure issues has never been easier. Follow these simple steps.
                </p>
            </div>

            {/* Desktop Timeline */}
            <div className="hidden lg:block relative">
                {/* Connecting Line */}
                <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-success"></div>

                <div className="grid grid-cols-4 gap-8">
                    {steps.map((item, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            {/* Icon Circle */}
                            <div className={`${item.color} w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg z-10 mb-6`}>
                                <item.icon className="text-3xl" />
                            </div>

                            {/* Step Number */}
                            <span className="text-5xl font-bold text-base-300 mb-2">{item.step}</span>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile/Tablet Timeline */}
            <div className="lg:hidden space-y-8">
                {steps.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        {/* Icon and Line */}
                        <div className="flex flex-col items-center">
                            <div className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                                <item.icon className="text-2xl" />
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-1 flex-grow bg-gradient-to-b from-primary to-success mt-2"></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="pb-8">
                            <span className="text-3xl font-bold text-base-300">{item.step}</span>
                            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
