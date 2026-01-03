// src/components/Home/BannerSection.jsx

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router';
import { FaArrowRight, FaChevronDown, FaRoad, FaLightbulb, FaShieldAlt, FaTools, FaMapMarkerAlt } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slidesData = [
    {
        id: 1,
        title: 'Report Issues,',
        highlight: 'Build Better Cities',
        subtitle: 'A digital platform connecting citizens and municipal services for transparent infrastructure management.',
        buttonText: 'Report an Issue',
        link: '/dashboard/citizen/report-issue',
        gradient: 'from-blue-900/90 via-purple-900/85 to-pink-900/80',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80',
        Icon: FaRoad
    },
    {
        id: 2,
        title: 'Track Repairs',
        highlight: 'in Real-Time',
        subtitle: 'Full transparency from report submission to resolution. Monitor progress with our detailed timeline system.',
        buttonText: 'View All Issues',
        link: '/all-issues',
        gradient: 'from-emerald-900/90 via-teal-900/85 to-cyan-900/80',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80',
        Icon: FaLightbulb
    },
    {
        id: 3,
        title: 'Safe Streets,',
        highlight: 'Happy Citizens',
        subtitle: 'From potholes to streetlights - report any infrastructure issue and help make your community safer.',
        buttonText: 'Get Started',
        link: '/register',
        gradient: 'from-orange-900/90 via-red-900/85 to-pink-900/80',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80',
        Icon: FaShieldAlt
    }
];

// Floating icon component
const FloatingIcon = ({ Icon, delay, duration, position }) => (
    <div
        className={`absolute ${position} text-white/10`}
        style={{
            animation: `float ${duration}s ease-in-out ${delay}s infinite`
        }}
    >
        <Icon className="text-6xl md:text-8xl" />
    </div>
);

const BannerSection = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    };

    return (
        <>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-20px) rotate(5deg); }
                    50% { transform: translateY(-10px) rotate(-5deg); }
                    75% { transform: translateY(-30px) rotate(3deg); }
                }

                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-100px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }

                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }

                .animate-slide-in-left {
                    animation: slideInLeft 1s ease-out forwards;
                }

                .animate-slide-in-right {
                    animation: slideInRight 1s ease-out forwards;
                }

                .animate-fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scaleIn 0.8s ease-out forwards;
                }

                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    background-size: 1000px 100%;
                    animation: shimmer 3s infinite;
                }
            `}</style>

            <section className='relative h-[70vh] md:h-[85vh] w-full overflow-hidden'>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    effect='fade'
                    fadeEffect={{ crossFade: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true
                    }}
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                    loop={true}
                    className='w-full h-full'
                >
                    {slidesData.map((slide, index) => (
                        <SwiperSlide key={slide.id}>
                            <div className='relative w-full h-full'>
                                {/* Background Image */}
                                <div
                                    className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                                    style={{
                                        backgroundImage: `url('${slide.image}')`,
                                    }}
                                />

                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />

                                {/* Animated background elements */}
                                <div className='absolute inset-0 overflow-hidden'>
                                    {/* Floating orbs with different animations */}
                                    <div className='absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse'
                                         style={{ animationDuration: '4s' }} />
                                    <div className='absolute top-1/4 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse'
                                         style={{ animationDuration: '6s', animationDelay: '1s' }} />
                                    <div className='absolute bottom-10 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse'
                                         style={{ animationDuration: '5s', animationDelay: '2s' }} />

                                    {/* Floating icons */}
                                    <FloatingIcon Icon={FaRoad} delay={0} duration={6} position="top-20 left-[10%]" />
                                    <FloatingIcon Icon={FaLightbulb} delay={1} duration={7} position="top-40 right-[15%]" />
                                    <FloatingIcon Icon={FaTools} delay={2} duration={8} position="bottom-32 left-[20%]" />
                                    <FloatingIcon Icon={FaMapMarkerAlt} delay={0.5} duration={6.5} position="bottom-20 right-[25%]" />
                                </div>

                                {/* Grid pattern overlay */}
                                <div className='absolute inset-0 opacity-5'
                                     style={{
                                         backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                                         backgroundSize: '60px 60px'
                                     }}
                                />

                                {/* Shimmer effect overlay */}
                                <div className='absolute inset-0 shimmer opacity-20' />

                                {/* Content */}
                                <div className='relative z-10 h-full flex items-center'>
                                    <div className='container mx-auto px-4 md:px-8 lg:px-16'>
                                        <div className='max-w-5xl'>
                                            {/* Badge with icon */}
                                            <div className={`inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-white/30 shadow-lg ${mounted ? 'animate-scale-in' : 'opacity-0'}`}
                                                 style={{ animationDelay: '0.2s' }}>
                                                <slide.Icon className='text-white text-lg' />
                                                <span className='text-white font-semibold text-sm tracking-wide'>Infrastructure Reporting Platform</span>
                                            </div>

                                            {/* Main heading */}
                                            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black text-white mb-3 leading-tight drop-shadow-2xl ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}
                                                style={{ animationDelay: '0.4s' }}>
                                                {slide.title}
                                            </h1>

                                            {/* Highlighted text with gradient */}
                                            <h2 className={`text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-2xl ${mounted ? 'animate-slide-in-right' : 'opacity-0'}`}
                                                style={{ animationDelay: '0.6s' }}>
                                                {slide.highlight}
                                            </h2>

                                            {/* Subtitle */}
                                            <p className={`text-xl md:text-2xl text-white/90 max-w-3xl mb-10 leading-relaxed font-medium drop-shadow-lg ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                                               style={{ animationDelay: '0.8s' }}>
                                                {slide.subtitle}
                                            </p>

                                            {/* Buttons */}
                                            <div className={`flex flex-wrap gap-5 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                                                 style={{ animationDelay: '1s' }}>
                                                <Link to={slide.link}
                                                      className='group relative inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105'>
                                                    <span className='absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity' />
                                                    <span className='relative'>{slide.buttonText}</span>
                                                    <FaArrowRight className='relative group-hover:translate-x-2 transition-transform duration-300' />
                                                </Link>

                                                <Link to='/all-issues'
                                                      className='inline-flex items-center gap-3 bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-lg border-2 border-white/40 hover:bg-white/30 hover:border-white/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
                                                    Explore Issues
                                                </Link>
                                            </div>

                                            {/* Stats */}
                                            <div className={`flex flex-wrap gap-10 md:gap-16 mt-16 pt-10 border-t-2 border-white/30 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
                                                 style={{ animationDelay: '1.2s' }}>
                                                <div className='group cursor-default'>
                                                    <div className='text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform'>10K+</div>
                                                    <div className='text-white/70 text-sm font-semibold uppercase tracking-wider'>Issues Resolved</div>
                                                </div>
                                                <div className='group cursor-default'>
                                                    <div className='text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform'>50+</div>
                                                    <div className='text-white/70 text-sm font-semibold uppercase tracking-wider'>Cities Covered</div>
                                                </div>
                                                <div className='group cursor-default'>
                                                    <div className='text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform'>95%</div>
                                                    <div className='text-white/70 text-sm font-semibold uppercase tracking-wider'>Satisfaction Rate</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Scroll down indicator */}
                <button
                    onClick={scrollToContent}
                    className='absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-white/80 hover:text-white transition-all duration-300 group cursor-pointer'
                >
                    <span className='text-sm font-bold uppercase tracking-widest'>Scroll Down</span>
                    <div className='w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2 group-hover:border-white transition-colors'>
                        <div className='w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce group-hover:bg-white' />
                    </div>
                </button>
            </section>
        </>
    );
};

export default BannerSection;
