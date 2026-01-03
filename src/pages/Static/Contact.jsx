// src/pages/Static/Contact.jsx

import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

const contactInfo = [
    { icon: FaMapMarkerAlt, title: 'Address', content: '123 Municipal Building, Dhaka 1000, Bangladesh' },
    { icon: FaPhone, title: 'Phone', content: '+880 1234-567890', link: 'tel:+8801234567890' },
    { icon: FaEnvelope, title: 'Email', content: 'support@potholespatrols.com', link: 'mailto:support@potholespatrols.com' },
    { icon: FaClock, title: 'Working Hours', content: 'Sun - Thu: 9:00 AM - 5:00 PM' }
];

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">Have questions? We are here to help.</p>
                </div>
            </section>

            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Name</span></label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered" required />
                                        </div>
                                        <div className="form-control">
                                            <label className="label"><span className="label-text">Email</span></label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered" required />
                                        </div>
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Subject</span></label>
                                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Message</span></label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} className="textarea textarea-bordered h-32" required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                                        {isLoading ? <span className="loading loading-spinner"></span> : <><FaPaperPlane className="mr-2" /> Send</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Get in Touch</h2>
                            <div className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-base-200 rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <info.icon className="text-xl text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{info.title}</h3>
                                            {info.link ? <a href={info.link} className="text-base-content/70 hover:text-primary">{info.content}</a> : <p className="text-base-content/70">{info.content}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
