import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import one from '../utils/image/payment_icon/one.png'
import two from '../utils/image/payment_icon/two.png'
import three from '../utils/image/payment_icon/three.png'
import four from '../utils/image/payment_icon/four.png'

const Footer = () => {
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const emailRef = useRef(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('customercareproductcenter@gmail.com');
    setShowCopyPopup(true);
    
    // Hide popup after 2 seconds
    setTimeout(() => {
      setShowCopyPopup(false);
    }, 2000);
  };

  return (
    <footer className="bg-[#343B3E] text-white">
      {/* YouTube Subscription Section */}
      <div className="py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <section className="bg-white py-6 sm:py-8 md:py-12 px-3 sm:px-4 text-center rounded-xl sm:rounded-2xl shadow-md max-w-3xl mx-auto">
          <div className="">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <img src="https://www.svgrepo.com/show/13671/youtube.svg" alt="YouTube" className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 mr-2 md:block hidden" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Subscribe to Our YouTube Channel</h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 px-2">
              Stay connected for wellness tips, product tutorials, and health insights!
            </p>
            <a href="https://www.youtube.com/@glowglaz" target="_blank" rel="noopener noreferrer" className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base md:text-lg font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition duration-300">
              <svg className="inline h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 15l5.19-3L10 9v6z"/>
                <path d="M21 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.8C15 5 12 5 12 5h0s-3 0-6 .2c-.4 0-1.3 0-2.1.8-.6.6-.8 2-.8 2S3 9.6 3 11.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.9.8 2.4.9C9 19 12 19 12 19s3 0 6-.2c.5 0 1.6 0 2.4-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6C21.2 9.6 21 8 21 8z"/>
              </svg>
              Subscribe Now
            </a>
          </div>
        </section>
      </div>
      
      {/* Main Footer Links */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-8 border-t border-gray-700">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* About Column */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 uppercase">About</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition text-sm sm:text-base">About GlowGlaz</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition text-sm sm:text-base">FAQ</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Shipping & Returns</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Our Story</Link></li>
            </ul>
          </div>
          
          {/* Products Column */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 uppercase">Our Products</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/trending?category=ayurvedic-medicine" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Ayurvedic Medicine</Link></li>
              <li><Link to="/trending?category=body-slim" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Body Slim</Link></li>
              <li><Link to="/trending?category=skin-care" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Skin Care</Link></li>
              <li><Link to="/deals/psorigo" className="text-gray-300 hover:text-white transition text-sm sm:text-base">PSORIGO Collection</Link></li>
              <li><Link to="/offers" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Special Offers</Link></li>
            </ul>
          </div>
          
          {/* Shop By Column */}
          <div className="xs:col-span-2 md:col-span-1">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 uppercase">Shop By</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/trendproduct" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Trending Products</Link></li>
              <li><Link to="/deals/sampoorn-arogya" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Sampoorn Arogya</Link></li>
              <li><Link to="/deals/dr-joints" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Dr. Joints</Link></li>
              <li><Link to="/deals/beyondslim" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Beyondslim</Link></li>
              <li><Link to="/offers" className="text-gray-300 hover:text-white transition text-sm sm:text-base">All Deals</Link></li>
            </ul>
          </div>
          
          {/* Payment & Social Media Column */}
          <div className="xs:col-span-2 md:col-span-1">
            <div className="mb-5 sm:mb-6">
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 uppercase">We Accept</h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="bg-white p-1.5 sm:p-2 rounded-md h-8 sm:h-10 flex items-center justify-center">
                  <img 
                    src={one}
                    alt="Visa" 
                    className="h-4 sm:h-6 object-contain"
                  />
                </div>
                {/* <div className="bg-white p-1.5 sm:p-2 rounded-md h-8 sm:h-10 flex items-center justify-center">
                  <img 
                    src={two} 
                    alt="Mastercard" 
                    className="h-4 sm:h-6 object-contain"
                  /> */}
                {/* </div> */}
                <div className="bg-white p-1.5 sm:p-2 rounded-md h-8 sm:h-10 flex items-center justify-center">
                  <img 
                    src={three} 
                    alt="American Express" 
                    className="h-4 sm:h-6 object-contain"
                  />
                </div>
                <div className="bg-white p-1.5 sm:p-2 rounded-md h-8 sm:h-10 flex items-center justify-center">
                  <img 
                    src={four} 
                    alt="PayPal" 
                    className="h-4 sm:h-6 object-contain"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 uppercase">Follow Us</h4>
              <div className="flex gap-2 sm:gap-3">
                <a href="https://www.instagram.com/glowglazofficial" className="bg-white p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition">
                  <Instagram size={16} className="sm:w-5 sm:h-5 text-gray-800" />
                </a>
                <a href="https://www.facebook.com/people/Glowglaz/61574772250708/" className="bg-white p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition">
                  <Facebook size={16} className="sm:w-5 sm:h-5 text-gray-800" />
                </a>
                <a href="https://www.youtube.com/@glowglaz" className="bg-white p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition">
                  <Youtube size={16} className="sm:w-5 sm:h-5 text-gray-800" />
                </a>
                <div className="relative" ref={emailRef}>
                  <button 
                    onClick={handleCopyEmail}
                    className="bg-white p-1.5 sm:p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                    title="Click to copy email"
                  >
                    <Mail size={16} className="sm:w-5 sm:h-5 text-gray-800" />
                  </button>
                  {showCopyPopup && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Email copied!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
              
      {/* Copyright */}
      <div className="border-t border-gray-700 py-3 sm:py-4">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-gray-400">
          <p>© GlowGlaz 2024 All rights reserved. 
            <Link to="/terms" className="hover:text-white ml-1 sm:ml-2 transition">Terms & Conditions</Link> | 
            <Link to="/privacy" className="hover:text-white ml-1 sm:ml-2 transition">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;