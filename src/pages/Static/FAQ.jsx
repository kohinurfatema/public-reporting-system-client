// src/pages/Static/FAQ.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaQuestionCircle, FaFileAlt, FaClock, FaCrown, FaRocket, FaEye, FaUserTie, FaEnvelope } from 'react-icons/fa';

const faqs = [
    {
        q: 'How do I report an issue?',
        a: 'Create an account, go to your dashboard, and click Report Issue. Fill in the details and submit.',
        icon: <FaFileAlt />,
        color: 'border-primary',
        bgColor: 'bg-primary/5'
    },
    {
        q: 'How long does resolution take?',
        a: 'Minor issues take 3-7 days, major repairs may take 2-4 weeks. Track progress in your dashboard.',
        icon: <FaClock />,
        color: 'border-info',
        bgColor: 'bg-info/5'
    },
    {
        q: 'What is Premium subscription?',
        a: 'Free users can report 3 issues. Premium (1000 BDT) gives unlimited reporting and priority support.',
        icon: <FaCrown />,
        color: 'border-warning',
        bgColor: 'bg-warning/5'
    },
    {
        q: 'How does priority boost work?',
        a: 'Pay 100 BDT to boost any issue to high priority for faster attention from the municipal team.',
        icon: <FaRocket />,
        color: 'border-error',
        bgColor: 'bg-error/5'
    },
    {
        q: 'Can I track others issues?',
        a: 'Yes! Visit All Issues page to see and upvote community issues.',
        icon: <FaEye />,
        color: 'border-success',
        bgColor: 'bg-success/5'
    },
    {
        q: 'How do I become staff?',
        a: 'Staff accounts are created by administrators. Contact us if interested in joining the team.',
        icon: <FaUserTie />,
        color: 'border-secondary',
        bgColor: 'bg-secondary/5'
    }
];

const FAQ = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-accent via-primary to-secondary text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block mb-4">
                        <FaQuestionCircle className="text-6xl opacity-80" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Frequently Asked Questions</h1>
                    <p className="text-xl opacity-90">Find answers to common questions</p>
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mt-4">
                        <span className="font-semibold">Quick help at your fingertips</span>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Intro */}
                    <div className="card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 shadow-lg mb-12 border border-primary/20">
                        <div className="card-body text-center">
                            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                How can we help you?
                            </h2>
                            <p className="text-base-content/70 text-lg">Browse through our most commonly asked questions below</p>
                        </div>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className={`collapse collapse-arrow bg-base-100 shadow-lg border-l-4 ${faq.color} ${faq.bgColor}`}>
                                <input type="radio" name="faq" defaultChecked={i === 0} />
                                <div className="collapse-title text-lg font-bold flex items-center gap-3">
                                    <span className={`text-2xl ${faq.color.replace('border-', 'text-')}`}>
                                        {faq.icon}
                                    </span>
                                    {faq.q}
                                </div>
                                <div className="collapse-content">
                                    <div className="pt-2 pl-11">
                                        <p className="text-base-content/70 leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-2xl mt-12">
                        <div className="card-body text-center">
                            <FaEnvelope className="text-5xl mx-auto mb-4 opacity-80" />
                            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                            <p className="mb-4 opacity-90">We're here to help! Reach out to our support team</p>
                            <div>
                                <Link to="/contact" className="btn btn-accent btn-lg">
                                    <FaEnvelope className="mr-2" />
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
