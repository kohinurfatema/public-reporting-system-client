// src/components/Home/NewsletterSection.jsx

import React, { useState } from 'react';
import { FaPaperPlane, FaBell } from 'react-icons/fa';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Thank you for subscribing!');
        setEmail('');
        setIsLoading(false);
    };

    return (
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
                        <FaBell className="text-3xl" />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Stay Updated
                    </h2>
                    <p className="text-white/80 max-w-xl mx-auto mb-8">
                        Subscribe to our newsletter to receive updates about infrastructure improvements in your area and new platform features.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-lg flex-1 bg-white/10 border-white/20 placeholder-white/50 text-white focus:bg-white/20 focus:border-white/40"
                        />
                        <button 
                            type="submit" 
                            className="btn btn-lg bg-white text-primary hover:bg-white/90 border-0"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                <>
                                    <FaPaperPlane className="mr-2" />
                                    Subscribe
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-sm text-white/60 mt-4">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
