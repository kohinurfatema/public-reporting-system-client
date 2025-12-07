// src/components/Home/BannerSection.jsx

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Dummy data for the slider slides
const slidesData = [
    {
        id: 1,
        title: "Report Issues, Build Better Cities.",
        subtitle: "A digital platform to connect citizens and municipal services seamlessly.",
        imageUrl: "https://i.ibb.co/q04tL3m/city-infrastructure-1.jpg", // Placeholder: cityscape/roads
        buttonText: "Report an Issue Now",
        link: "/dashboard/citizen/report-issue"
    },
    {
        id: 2,
        title: "Track Repairs in Real-Time.",
        subtitle: "Full transparency from report submission to resolution. Never wonder again.",
        imageUrl: "https://i.ibb.co/6P80y8V/city-infrastructure-2.jpg", // Placeholder: workers fixing road/pothole
        buttonText: "View All Issues",
        link: "/all-issues"
    },
    {
        id: 3,
        title: "Potholes to Streetlights: We Fix It All.",
        subtitle: "Select from over 10 categories and prioritize problems that matter most.",
        imageUrl: "https://i.ibb.co/s338LmL/city-infrastructure-3.jpg", // Placeholder: broken streetlight/damage
        buttonText: "See How It Works",
        link: "/extra-page-2"
    }
];

const BannerSection = () => {
    return (
        // Wrapper for the entire banner section
        <section className="h-[60vh] md:h-[80vh] w-full mb-12">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full"
            >
                {slidesData.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {/* Slide Container */}
                        <div className="relative w-full h-full">
                            
                            {/* Background Image */}
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Dark Overlay (Unique Aesthetic) */}
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                                
                                {/* Content Box */}
                                <div className="text-center text-white px-6 md:px-12 max-w-4xl space-y-6">
                                    
                                    {/* Main Title */}
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight animate-fade-in-down">
                                        {slide.title}
                                    </h1>
                                    
                                    {/* Subtitle */}
                                    <p className="text-lg md:text-xl lg:text-2xl font-light opacity-90 animate-fade-in-up">
                                        {slide.subtitle}
                                    </p>
                                    
                                    {/* Call to Action Button */}
                                    <Link to={slide.link} className="btn btn-primary btn-lg mt-4 shadow-xl transform hover:scale-[1.03] transition-transform">
                                        {slide.buttonText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default BannerSection;