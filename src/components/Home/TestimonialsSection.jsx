// src/components/Home/TestimonialsSection.jsx

import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
    {
        name: 'Rahima Begum',
        role: 'Local Resident, Dhaka',
        image: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        text: 'I reported a dangerous pothole near my home and it was fixed within a week! The tracking system kept me informed throughout. Excellent service!',
        bgColor: 'bg-gradient-to-br from-primary/5 to-primary/10',
        borderColor: 'border-primary/30',
        quoteColor: 'text-primary'
    },
    {
        name: 'Mohammad Karim',
        role: 'Shop Owner, Chittagong',
        image: 'https://i.pravatar.cc/150?img=3',
        rating: 5,
        text: 'The streetlight outside my shop was broken for months. After reporting here, it was replaced in just 5 days. Very impressed with the response time.',
        bgColor: 'bg-gradient-to-br from-secondary/5 to-secondary/10',
        borderColor: 'border-secondary/30',
        quoteColor: 'text-secondary'
    },
    {
        name: 'Fatima Akter',
        role: 'Teacher, Sylhet',
        image: 'https://i.pravatar.cc/150?img=5',
        rating: 4,
        text: 'Finally a platform where citizens can voice their concerns about infrastructure. The staff is responsive and the app is easy to use.',
        bgColor: 'bg-gradient-to-br from-accent/5 to-accent/10',
        borderColor: 'border-accent/30',
        quoteColor: 'text-accent'
    },
    {
        name: 'Abdul Rahman',
        role: 'Business Owner, Rajshahi',
        image: 'https://i.pravatar.cc/150?img=8',
        rating: 5,
        text: 'Water leakage in our area was causing problems for weeks. Reported it here and the municipality fixed it promptly. Great initiative!',
        bgColor: 'bg-gradient-to-br from-success/5 to-success/10',
        borderColor: 'border-success/30',
        quoteColor: 'text-success'
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-16 md:py-20 bg-base-200">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="badge badge-secondary badge-lg mb-4">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        What Citizens Say
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Real stories from real citizens who have used our platform to improve their communities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 ${testimonial.borderColor} ${testimonial.bgColor} relative overflow-hidden`}
                        >
                            {/* Decorative corner */}
                            <div className={`absolute top-0 right-0 w-20 h-20 ${testimonial.quoteColor} opacity-5 transform rotate-45 translate-x-10 -translate-y-10`}></div>

                            <div className="card-body p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`p-3 rounded-xl ${testimonial.bgColor} shadow-md`}>
                                        <FaQuoteLeft className={`text-2xl ${testimonial.quoteColor}`} />
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < testimonial.rating ? 'text-warning text-lg' : 'text-base-300 text-lg'}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-base-content/80 italic mb-6 leading-relaxed">
                                    "{testimonial.text}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto pt-4 border-t-2 border-base-300">
                                    <div className="avatar">
                                        <div className={`w-14 h-14 rounded-full ring-2 ${testimonial.borderColor.replace('border-', 'ring-')} ring-offset-base-100 ring-offset-2`}>
                                            <img src={testimonial.image} alt={testimonial.name} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                        <p className="text-sm text-base-content/60 font-medium">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
