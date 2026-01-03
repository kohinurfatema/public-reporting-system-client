// src/components/Home/TestimonialsSection.jsx

import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
    {
        name: 'Rahima Begum',
        role: 'Local Resident, Dhaka',
        image: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        text: 'I reported a dangerous pothole near my home and it was fixed within a week! The tracking system kept me informed throughout. Excellent service!'
    },
    {
        name: 'Mohammad Karim',
        role: 'Shop Owner, Chittagong',
        image: 'https://i.pravatar.cc/150?img=3',
        rating: 5,
        text: 'The streetlight outside my shop was broken for months. After reporting here, it was replaced in just 5 days. Very impressed with the response time.'
    },
    {
        name: 'Fatima Akter',
        role: 'Teacher, Sylhet',
        image: 'https://i.pravatar.cc/150?img=5',
        rating: 4,
        text: 'Finally a platform where citizens can voice their concerns about infrastructure. The staff is responsive and the app is easy to use.'
    },
    {
        name: 'Abdul Rahman',
        role: 'Business Owner, Rajshahi',
        image: 'https://i.pravatar.cc/150?img=8',
        rating: 5,
        text: 'Water leakage in our area was causing problems for weeks. Reported it here and the municipality fixed it promptly. Great initiative!'
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
                            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="card-body">
                                <FaQuoteLeft className="text-3xl text-primary/20 mb-2" />
                                <p className="text-base-content/80 italic mb-4">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="avatar">
                                        <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={testimonial.image} alt={testimonial.name} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold">{testimonial.name}</h4>
                                        <p className="text-sm text-base-content/60">{testimonial.role}</p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < testimonial.rating ? 'text-warning' : 'text-base-300'}
                                            />
                                        ))}
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
