import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaLeaf, FaHeart, FaShieldAlt, FaCheck, FaMedal, FaCertificate } from 'react-icons/fa';
import productData from '../utils/data/product';
import SEO from '../components/SEO';

const About = () => {
  const location = useLocation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  
  // Get banners from product data
  const banners = productData.aboutBanner;
  
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

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="About GlowGlaz - Our Mission & Vision | Ayurvedic Health Products"
        description="Learn about GlowGlaz's mission to provide authentic Ayurvedic and natural health solutions. Discover our story, values, and commitment to quality products."
        canonical="https://glowglaz.com/about"
      />
      
      {/* Hero Section with Banner */}
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
                className="relative w-full h-[400px] bg-cover bg-center flex items-center justify-center"
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

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                At GlowGlaz, we're on a mission to bring the time-tested wisdom of Ayurveda and natural remedies 
                to modern wellness. We believe that true health comes from balanced living and natural solutions 
                that work in harmony with your body.
              </p>
              <p className="text-gray-700">
                Every product we offer is carefully formulated to address specific health needs while maintaining 
                our commitment to purity, sustainability, and effectiveness.
              </p>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-700 mb-6">
                We envision a world where traditional wisdom meets modern science, creating wellness solutions 
                that are accessible, effective, and respectful of both human health and environmental sustainability.
              </p>
              <p className="text-gray-700">
                By 2025, we aim to become the leading provider of authentic Ayurvedic and natural wellness 
                products, recognized for our innovation, quality, and customer-centric approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-3">Natural Authenticity</h3>
              <p className="text-gray-700">
                We source the purest ingredients, prioritizing organic and natural components that honor 
                traditional formulations while meeting modern standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-3">Customer Wellbeing</h3>
              <p className="text-gray-700">
                Your health is our priority. We create products that deliver real results and support 
                your journey toward balanced, sustained wellness.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-purple-600 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-3">Scientific Integrity</h3>
              <p className="text-gray-700">
                We combine traditional wisdom with modern research to ensure every formula is 
                effective, safe, and backed by scientific understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-700 mb-6">
              GlowGlaz was founded in 2015 by a team of Ayurvedic practitioners and modern healthcare professionals 
              who shared a vision: making authentic natural wellness accessible to everyone.
            </p>
            
            <p className="text-gray-700 mb-6">
              What started as a small collection of traditional Ayurvedic formulations has grown into a comprehensive 
              line of health and wellness products that address modern concerns while honoring ancient wisdom. From 
              our Sampoorn Arogya supplements to our specialized PSORIGO skin care line, every product reflects our 
              commitment to quality and effectiveness.
            </p>
            
            <p className="text-gray-700">
              Today, we continue to innovate while staying true to our roots, bringing you the best of natural wellness 
              with scientific validation and sustainable practices at every step of our journey.
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Product Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <h3 className="font-bold text-xl mb-4 text-green-800">Ayurvedic Medicine</h3>
              <p className="text-gray-700 mb-6">
                Traditional formulations based on ancient Ayurvedic principles, designed to promote 
                holistic health and balance in the body.
              </p>
              <div className="text-green-700 font-bold">Featured Product:</div>
              <div className="text-gray-800">Sampoorn Arogya Herbal Supplement</div>
            </div>
            
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <h3 className="font-bold text-xl mb-4 text-blue-800">Joint Health</h3>
              <p className="text-gray-700 mb-6">
                Specialized formulas that support mobility, flexibility, and joint comfort for 
                active individuals and those seeking relief.
              </p>
              <div className="text-blue-700 font-bold">Featured Product:</div>
              <div className="text-gray-800">Dr. Joints Advanced Joint Health Formula</div>
            </div>
            
            <div className="bg-gradient-to-b from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <h3 className="font-bold text-xl mb-4 text-orange-800">Weight Management</h3>
              <p className="text-gray-700 mb-6">
                Natural solutions that support healthy metabolism and weight management goals 
                through balanced, scientifically-supported approaches.
              </p>
              <div className="text-orange-700 font-bold">Featured Product:</div>
              <div className="text-gray-800">Beyondslim ZipSlim Drink Mix</div>
            </div>
            
            <div className="bg-gradient-to-b from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200">
              <h3 className="font-bold text-xl mb-4 text-teal-800">Skin Care</h3>
              <p className="text-gray-700 mb-6">
                Natural, gentle formulations for sensitive and problem skin, featuring herbal 
                ingredients that soothe, protect, and restore skin health.
              </p>
              <div className="text-teal-700 font-bold">Featured Product:</div>
              <div className="text-gray-800">PSORIGO Complete Skincare Collection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Commitment to Quality</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaCheck className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-2">GMP Certified</h3>
              <p className="text-gray-700">
                All our products are manufactured in facilities that follow Good Manufacturing Practices.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaMedal className="text-red-600 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-2">Quality Tested</h3>
              <p className="text-gray-700">
                Every batch undergoes rigorous testing for purity, potency, and safety before reaching you.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaCertificate className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-2">Ayush Certified</h3>
              <p className="text-gray-700">
                Our Ayurvedic products are certified by AYUSH (Department of Ayurveda, Yoga & Naturopathy, Unani, Siddha and Homoeopathy).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Have questions about our products or want to learn more about our journey? 
            Our team is here to help you find the right wellness solutions.
          </p>
          <a href='/contact'>
          <button className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-md">
            Contact Us
          </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
