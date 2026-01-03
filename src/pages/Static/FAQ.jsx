// src/pages/Static/FAQ.jsx

import React from 'react';
import { Link } from 'react-router';

const faqs = [
    { q: 'How do I report an issue?', a: 'Create an account, go to your dashboard, and click Report Issue. Fill in the details and submit.' },
    { q: 'How long does resolution take?', a: 'Minor issues take 3-7 days, major repairs may take 2-4 weeks. Track progress in your dashboard.' },
    { q: 'What is Premium subscription?', a: 'Free users can report 3 issues. Premium (1000 BDT) gives unlimited reporting and priority support.' },
    { q: 'How does priority boost work?', a: 'Pay 100 BDT to boost any issue to high priority for faster attention from the municipal team.' },
    { q: 'Can I track others issues?', a: 'Yes! Visit All Issues page to see and upvote community issues.' },
    { q: 'How do I become staff?', a: 'Staff accounts are created by administrators. Contact us if interested in joining the team.' }
];

const FAQ = () => {
    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">FAQ</h1>
                    <p className="text-xl opacity-90">Frequently Asked Questions</p>
                </div>
            </section>
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="collapse collapse-plus bg-base-200 rounded-lg">
                                <input type="radio" name="faq" defaultChecked={i === 0} />
                                <div className="collapse-title text-lg font-semibold">{faq.q}</div>
                                <div className="collapse-content"><p className="text-base-content/70">{faq.a}</p></div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <p className="text-base-content/70 mb-4">Still have questions?</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
