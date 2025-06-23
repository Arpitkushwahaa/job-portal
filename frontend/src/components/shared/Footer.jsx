import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-bold">Job<span className='text-[#F83002]'>Portal</span></h2>
            <p className="text-gray-400">
              Your ultimate destination to find the perfect job or the ideal candidate. Connecting talent with opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#F83002] transition-colors duration-300">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-[#F83002] transition-colors duration-300">Jobs</Link></li>
              <li><Link to="/browse" className="hover:text-[#F83002] transition-colors duration-300">Browse</Link></li>
              <li><Link to="/login" className="hover:text-[#F83002] transition-colors duration-300">Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@jobportal.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Job St, Work City, WC 45678</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaLinkedin size={24} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;