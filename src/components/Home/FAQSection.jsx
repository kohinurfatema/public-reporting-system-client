// src/components/Home/FAQSection.jsx

import React from 'react';

const faqs = [
    {
        question: 'How do I report an infrastructure issue?',
        answer: 'Simply create an account, navigate to the dashboard, and click "Report Issue". Fill in the details including category, location, description, and optionally upload an image. Your report will be submitted to the relevant authorities.'
    },
    {
        question: 'How long does it take for issues to be resolved?',
        answer: 'Resolution time varies depending on the issue type and severity. Minor issues like streetlight repairs typically take 3-7 days, while major repairs like road damage may take 2-4 weeks. You can track progress in real-time through your dashboard.'
    },
    {
        question: 'Can I report issues anonymously?',
        answer: 'Currently, you need to create an account to report issues. This helps us maintain accountability and allows us to update you on the progress of your report. Your personal information is kept confidential.'
    },
    {
        question: 'What is the Premium subscription?',
        answer: 'Free users can report up to 3 issues. Premium subscribers (1000 BDT) get unlimited issue reporting, priority support, and the ability to boost issue priority for faster resolution.'
    },
    {
        question: 'How does the priority boost work?',
        answer: 'For 100 BDT, you can boost any of your reported issues to high priority. Boosted issues are highlighted to staff and typically receive faster attention from the municipal team.'
    },
    {
        question: 'Can I track issues reported by others?',
        answer: 'Yes! Visit the "All Issues" page to see all reported issues in your area. You can upvote issues you think are important, helping prioritize community concerns.'
    }
];

const FAQSection = () => {
    return (
        <section className="py-16 md:py-20 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="badge badge-accent badge-lg mb-4">FAQ</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Find answers to common questions about our platform and services.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="collapse collapse-plus bg-base-200 rounded-lg">
                            <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                            <div className="collapse-title text-lg font-semibold">
                                {faq.question}
                            </div>
                            <div className="collapse-content">
                                <p className="text-base-content/70 pt-2">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
