// src/pages/Shared/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLink, FaGavel, FaHeadset } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-base-200 via-base-200 to-base-300 text-base-content relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.327L13.789 5.071a2 2 0 00-3.578 0L3.341 16.673A2 2 0 005.13 20z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Potholes Patrols</p>
                <p className="text-lg font-bold">Report Hub</p>
              </div>
            </Link>
            <p className="text-sm opacity-80">
              Empowering citizens to report and track public infrastructure issues. Together, we build better cities.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none">
                <FaFacebook className="text-lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-sky-500 hover:bg-sky-600 text-white border-none">
                <FaTwitter className="text-lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-blue-700 hover:bg-blue-800 text-white border-none">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-none">
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-base-100/50 p-5 rounded-xl border-l-4 border-primary shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FaLink className="text-primary text-lg" />
              </div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
            </div>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/all-issues" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">All Issues</Link></li>
              <li><Link to="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="bg-base-100/50 p-5 rounded-xl border-l-4 border-secondary shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <FaGavel className="text-secondary text-lg" />
              </div>
              <h3 className="text-lg font-semibold">Legal</h3>
            </div>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors">Terms of Service</Link></li>
              <li><Link to="/help" className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-base-100/50 p-5 rounded-xl border-l-4 border-accent shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <FaHeadset className="text-accent text-lg" />
              </div>
              <h3 className="text-lg font-semibold">Contact Us</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-error/10 rounded-lg group-hover:bg-error/20 transition-colors">
                  <FaMapMarkerAlt className="text-error flex-shrink-0" />
                </div>
                <span className="text-sm opacity-80 mt-1.5">123 Municipal Building, Dhaka 1000, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors">
                  <FaPhone className="text-success flex-shrink-0" />
                </div>
                <a href="tel:+8801234567890" className="text-sm opacity-80 hover:opacity-100 hover:text-success transition-colors">+880 1234-567890</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-info/10 rounded-lg group-hover:bg-info/20 transition-colors">
                  <FaEnvelope className="text-info flex-shrink-0" />
                </div>
                <a href="mailto:support@potholespatrols.com" className="text-sm opacity-80 hover:opacity-100 hover:text-info transition-colors">support@potholespatrols.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 relative z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
            <p className="opacity-70">
              &copy; {currentYear} Potholes Patrols Report Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="badge badge-primary badge-sm">Transparent</span>
              <span className="badge badge-secondary badge-sm">Efficient</span>
              <span className="badge badge-accent badge-sm">Citizen-Focused</span>
            </div>
            <p className="opacity-70 font-medium">Built for transparent cities 🏙️</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
