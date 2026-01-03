// src/components/Home/FAQSection.jsx

import React from 'react';
import { FaFileAlt, FaClock, FaUserShield, FaCrown, FaRocket, FaEye } from 'react-icons/fa';

const faqs = [
    {
        question: 'How do I report an infrastructure issue?',
        answer: 'Simply create an account, navigate to the dashboard, and click "Report Issue". Fill in the details including category, location, description, and optionally upload an image. Your report will be submitted to the relevant authorities.',
        icon: <FaFileAlt />,
        bgColor: 'bg-primary/5',
        borderColor: 'border-primary/30',
        iconColor: 'text-primary'
    },
    {
        question: 'How long does it take for issues to be resolved?',
        answer: 'Resolution time varies depending on the issue type and severity. Minor issues like streetlight repairs typically take 3-7 days, while major repairs like road damage may take 2-4 weeks. You can track progress in real-time through your dashboard.',
        icon: <FaClock />,
        bgColor: 'bg-info/5',
        borderColor: 'border-info/30',
        iconColor: 'text-info'
    },
    {
        question: 'Can I report issues anonymously?',
        answer: 'Currently, you need to create an account to report issues. This helps us maintain accountability and allows us to update you on the progress of your report. Your personal information is kept confidential.',
        icon: <FaUserShield />,
        bgColor: 'bg-secondary/5',
        borderColor: 'border-secondary/30',
        iconColor: 'text-secondary'
    },
    {
        question: 'What is the Premium subscription?',
        answer: 'Free users can report up to 3 issues. Premium subscribers (1000 BDT) get unlimited issue reporting, priority support, and the ability to boost issue priority for faster resolution.',
        icon: <FaCrown />,
        bgColor: 'bg-warning/5',
        borderColor: 'border-warning/30',
        iconColor: 'text-warning'
    },
    {
        question: 'How does the priority boost work?',
        answer: 'For 100 BDT, you can boost any of your reported issues to high priority. Boosted issues are highlighted to staff and typically receive faster attention from the municipal team.',
        icon: <FaRocket />,
        bgColor: 'bg-error/5',
        borderColor: 'border-error/30',
        iconColor: 'text-error'
    },
    {
        question: 'Can I track issues reported by others?',
        answer: 'Yes! Visit the "All Issues" page to see all reported issues in your area. You can upvote issues you think are important, helping prioritize community concerns.',
        icon: <FaEye />,
        bgColor: 'bg-success/5',
        borderColor: 'border-success/30',
        iconColor: 'text-success'
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

                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className={`collapse collapse-arrow bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-l-4 ${faq.borderColor} ${faq.bgColor}`}>
                            <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                            <div className="collapse-title text-lg font-bold flex items-center gap-3 pr-12">
                                <div className={`p-3 rounded-xl ${faq.bgColor} shadow-md`}>
                                    <span className={`text-xl ${faq.iconColor}`}>
                                        {faq.icon}
                                    </span>
                                </div>
                                <span>{faq.question}</span>
                            </div>
                            <div className="collapse-content">
                                <div className="pl-16 pt-2">
                                    <p className="text-base-content/70 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
