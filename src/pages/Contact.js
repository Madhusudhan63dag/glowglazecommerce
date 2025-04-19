import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import productData from '../utils/data/product';
import SEO from '../components/SEO';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  
  // Get data from product.js
  const banners = productData.contactBanner;
  const contactInfo = productData.contactInfo;
  const productSupport = productData.productSupport;
  const contactFaqs = productData.contactFaqs;

  // Get the icon component based on icon name
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'MapMarkerAlt': return <FaMapMarkerAlt className={`text-${contactInfo.location.color}-600 text-2xl`} />;
      case 'PhoneAlt': return <FaPhoneAlt className={`text-${contactInfo.phone.color}-600 text-2xl`} />;
      case 'Envelope': return <FaEnvelope className={`text-${contactInfo.email.color}-600 text-2xl`} />;
      case 'Clock': return <FaClock className={`text-${contactInfo.hours.color}-600 text-2xl`} />;
      default: return null;
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Banner animation effects
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setAnimationPhase('recoil');
      setTimeout(() => {
        setAnimationPhase('slide');
        setPrevBanner(currentBanner);
        setCurrentBanner((prevBanner) =>
          prevBanner === banners.length - 1 ? 0 : prevBanner + 1
        );
      }, 200);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, currentBanner]);

  useEffect(() => {
    if (animationPhase === 'slide' && currentBanner !== prevBanner) {
      setTimeout(() => {
        setAnimationPhase('bounce1');
        setTimeout(() => {
          setAnimationPhase('bounce2');
          setTimeout(() => {
            setAnimationPhase('bounce3');
            setTimeout(() => {
              setAnimationPhase('bounce4');
              setTimeout(() => {
                setAnimationPhase('idle');
              }, 150);
            }, 150);
          }, 150);
        }, 150);
      }, 500);
    }
  }, [currentBanner, prevBanner, animationPhase]);

  const getSliderTransform = () => {
    const baseTransform = `translateX(-${currentBanner * 100}%)`;

    switch (animationPhase) {
      case 'recoil':
        return `${baseTransform} translateX(-30px)`;
      case 'bounce1':
        return `${baseTransform} translateY(-20px)`;
      case 'bounce2':
        return `${baseTransform} translateY(0px)`;
      case 'bounce3':
        return `${baseTransform} translateY(-15px)`;
      case 'bounce4':
        return `${baseTransform} translateY(0px)`;
      default:
        return baseTransform;
    }
  };

  const goToBanner = (index) => {
    if (index !== currentBanner) {
      setAnimationPhase('recoil');
      setTimeout(() => {
        setPrevBanner(currentBanner);
        setCurrentBanner(index);
        setAnimationPhase('slide');
      }, 200);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage({
        type: 'success',
        text: 'Thank you for your message. We will get back to you shortly!'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
    }, 1500);
  };

  // Render contact info item
  const renderContactItem = (item) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className={`bg-${item.color}-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
          {getIconComponent(item.icon)}
        </div>
        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
        <p className="text-gray-600">
          {item.details.map((detail, idx) => (
            <React.Fragment key={idx}>
              {typeof detail === 'string' ? (
                <>{detail}<br /></>
              ) : (
                <>
                  {detail.type === 'email' ? (
                    <a href={detail.href} className="text-blue-600 hover:underline">{detail.text}</a>
                  ) : (
                    <span className="block mt-2">{detail.text}</span>
                  )}
                  <br />
                </>
              )}
            </React.Fragment>
          ))}
          {item.highlight && <span className="block mt-2 font-medium">{item.highlight}</span>}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Contact Us - GlowGlaz"
        description="Get in touch with the GlowGlaz team for questions about our Ayurvedic products, orders, or customer support. Find our contact details, hours, and location information."
        canonical="https://glowglaz.com/contact"
      />
      
      {/* Banner Section */}
      <section className="relative overflow-hidden">
        <div
          className={`flex transition-transform ${
            animationPhase === 'recoil'
              ? 'duration-200'
              : ['bounce1', 'bounce2', 'bounce3', 'bounce4'].includes(animationPhase)
              ? 'duration-150'
              : 'duration-500'
          } ease-in-out`}
          style={{ transform: getSliderTransform() }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="w-full flex-shrink-0">
              <div
                className="relative w-full h-[300px] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
              </div>
            </div>
          ))}
        </div>
        
        {banners.length > 1 && (
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentBanner === index ? 'bg-white' : 'bg-gray-400'
                }`}
                onClick={() => goToBanner(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Contact Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderContactItem(contactInfo.location)}
            {renderContactItem(contactInfo.phone)}
            {renderContactItem(contactInfo.email)}
            {renderContactItem(contactInfo.hours)}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              {submitMessage && (
                <div className={`mb-6 p-4 rounded ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {submitMessage.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Product Information">Product Information</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Return/Refund">Return/Refund</option>
                      <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Product Support Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Product Support</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {productSupport.map((support, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-b from-${support.color}-50 to-${support.color}-100 p-6 rounded-lg border border-${support.color}-200 text-center`}
              >
                <h3 className={`font-bold text-xl mb-4 text-${support.color}-800`}>{support.title}</h3>
                <p className="text-gray-700 mb-6">
                  {support.description}
                </p>
                <a 
                  href={`mailto:${support.email}`} 
                  className={`bg-${support.color}-600 hover:bg-${support.color}-700 text-white px-6 py-2 rounded-md font-medium inline-block`}
                >
                  Get Support
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Location</h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="aspect-video w-full">
              {/* Replace with an actual Google Maps embed */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <FaMapMarkerAlt className="text-4xl mx-auto mb-2" />
                  <p className="font-medium">Interactive Map</p>
                  <p className="text-sm">(Google Maps will appear here)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {contactFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect With Us */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <FaYoutube className="text-xl" />
            </a>
          </div>
          
          <p className="max-w-2xl mx-auto">
            Follow us on social media for the latest product updates, wellness tips, and exclusive offers. Join our community of wellness enthusiasts!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
