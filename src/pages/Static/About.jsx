// src/pages/Static/About.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaUsers, FaCity, FaHandshake, FaAward } from 'react-icons/fa';

const stats = [
    { icon: FaUsers, value: '10,000+', label: 'Active Citizens' },
    { icon: FaCity, value: '50+', label: 'Cities Covered' },
    { icon: FaHandshake, value: '95%', label: 'Resolution Rate' },
    { icon: FaAward, value: '5 Years', label: 'Of Service' }
];

const team = [
    { name: 'Dr. Aminul Islam', role: 'Founder & CEO', image: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Fatima Rahman', role: 'CTO', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Kamal Hossain', role: 'Operations Head', image: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Nasrin Akter', role: 'Community Manager', image: 'https://i.pravatar.cc/150?img=9' }
];

const About = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Building bridges between citizens and municipalities for better infrastructure management.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                <p className="text-base-content/70 mb-4">
                                    Potholes Patrols Report Hub was founded with a simple yet powerful mission: to empower citizens 
                                    to actively participate in improving their communities infrastructure.
                                </p>
                                <p className="text-base-content/70 mb-4">
                                    We believe that every citizen deserves safe roads, working streetlights, and properly maintained 
                                    public spaces. Our platform makes it easy to report issues and track their resolution.
                                </p>
                                <Link to="/all-issues" className="btn btn-primary">
                                    View Reported Issues
                                </Link>
                            </div>
                            <div className="bg-base-200 rounded-2xl p-8">
                                <img 
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500" 
                                    alt="Team collaboration" 
                                    className="rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                                    <stat.icon className="text-2xl" />
                                </div>
                                <div className="text-3xl font-bold text-base-content">{stat.value}</div>
                                <div className="text-base-content/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {team.map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="avatar mb-4">
                                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={member.image} alt={member.name} />
                                    </div>
                                </div>
                                <h3 className="font-semibold">{member.name}</h3>
                                <p className="text-sm text-base-content/60">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                    <p className="opacity-90 mb-8 max-w-xl mx-auto">
                        Join thousands of citizens who are actively improving their communities.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/register" className="btn bg-white text-primary hover:bg-white/90 border-0">
                            Get Started
                        </Link>
                        <Link to="/contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
