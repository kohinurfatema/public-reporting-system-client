// src/pages/Shared/Footer/Footer.jsx

import React from 'react';
import { Link } from 'react-router';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
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
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                <FaFacebook className="text-lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                <FaTwitter className="text-lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                <FaInstagram className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/all-issues" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">All Issues</Link></li>
              <li><Link to="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/help" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span className="text-sm opacity-80">123 Municipal Building, Dhaka 1000, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:+8801234567890" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">+880 1234-567890</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href="mailto:support@potholespatrols.com" className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-colors">support@potholespatrols.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm opacity-70">
            <p>&copy; {currentYear} Potholes Patrols Report Hub. All rights reserved.</p>
            <p>Built for transparent cities.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
