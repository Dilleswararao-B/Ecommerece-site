import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => (
  <footer className="bg-white text-gray-800 py-10 mt-12 border-t border-gray-200">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 px-4">
      {/* Logo and Copyright */}
      <div className="flex flex-col items-center md:items-start gap-3">
        <Link to="/">
          <img src={assets.logo2} alt="Logo" className="w-36 h-10 object-cover mb-2" />
        </Link>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Your E-Commerce Site. All rights reserved.</p>
      </div>
      {/* Get in Touch */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <h3 className="font-semibold text-lg mb-1 text-gray-900">Get in Touch</h3>
        <p className="text-gray-700 text-sm">Customer Care: <a href="tel:+1234567890" className="underline">+1 234 567 890</a></p>
        <p className="text-gray-700 text-sm">Email: <a href="mailto:support@ecommerce.com" className="underline">support@ecommerce.com</a></p>
        <p className="text-gray-700 text-sm">123 Main Street, City, Country</p>
      </div>
      {/* Quick Links */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <h3 className="font-semibold text-lg mb-1 text-gray-900">Quick Links</h3>
        <Link to="/about" className="text-gray-700 text-sm hover:underline">About Us</Link>
        <Link to="/collection" className="text-gray-700 text-sm hover:underline">Collections</Link>
        <Link to="/contact" className="text-gray-700 text-sm hover:underline">Contact</Link>
        <Link to="/cart" className="text-gray-700 text-sm hover:underline">Cart</Link>
      </div>
      {/* Social Media */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <h3 className="font-semibold text-lg mb-1 text-gray-900">Follow Us</h3>
        <div className="flex gap-3">
          <a href="#" className="text-gray-700 hover:text-black">Facebook</a>
          <a href="#" className="text-gray-700 hover:text-black">Instagram</a>
          <a href="#" className="text-gray-700 hover:text-black">Twitter</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
