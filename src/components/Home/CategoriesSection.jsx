// src/components/Home/CategoriesSection.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaRoad, FaLightbulb, FaTint, FaTrash, FaWalking, FaTools } from 'react-icons/fa';

const categories = [
    {
        icon: FaRoad,
        name: 'Pothole',
        description: 'Report damaged roads and potholes affecting traffic safety',
        count: 156,
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: FaLightbulb,
        name: 'Streetlight',
        description: 'Report broken or malfunctioning street lights',
        count: 89,
        color: 'from-yellow-400 to-orange-500'
    },
    {
        icon: FaTint,
        name: 'Water Leakage',
        description: 'Report water pipe leaks and drainage issues',
        count: 124,
        color: 'from-blue-400 to-cyan-500'
    },
    {
        icon: FaTrash,
        name: 'Garbage Overflow',
        description: 'Report overflowing bins and waste management issues',
        count: 203,
        color: 'from-green-500 to-emerald-600'
    },
    {
        icon: FaWalking,
        name: 'Damaged Footpath',
        description: 'Report broken sidewalks and pedestrian pathways',
        count: 67,
        color: 'from-purple-500 to-indigo-600'
    },
    {
        icon: FaTools,
        name: 'Other Infrastructure',
        description: 'Report other public infrastructure problems',
        count: 45,
        color: 'from-gray-500 to-slate-600'
    }
];

const CategoriesSection = () => {
    return (
        <section className="py-16 md:py-20 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="badge badge-primary badge-lg mb-4">Issue Categories</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        What Can You Report?
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Select from our comprehensive list of infrastructure categories to report issues in your area.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={"/all-issues?category=" + category.name}
                            className="group card bg-base-100 border-2 border-base-300 hover:border-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <div className={"p-4 rounded-2xl bg-gradient-to-br " + category.color + " text-white shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300"}>
                                        <category.icon className="text-3xl" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors mb-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-base-content/70 leading-relaxed">
                                            {category.description}
                                        </p>
                                        <div className="mt-4">
                                            <span className="badge badge-primary badge-md font-semibold">
                                                {category.count} reports
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link to="/all-issues" className="btn btn-primary btn-wide">
                        View All Issues
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
