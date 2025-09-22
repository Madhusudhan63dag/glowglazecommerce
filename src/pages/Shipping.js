import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTruck, FaBox, FaExchangeAlt, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import productData from '../utils/data/product';
import {shippingBanner} from '../utils/data/banner';

const Shipping = () => {
  const location = useLocation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [activeTab, setActiveTab] = useState('shipping'); // shipping or returns
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  
  // Get data from product.js
  const banners = shippingBanner;
  const shippingPolicy = productData.shippingPolicy;
  const returnPolicy = productData.returnPolicy;
  const shippingFaqs = productData.shippingFaqs;

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

  const toggleFaq = (id) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const getBannerImageUrl = (banner) => {
    // Check if banner has responsive imageUrl object
    if (typeof banner.imageUrl === 'object' && banner.imageUrl !== null) {
      return isMobile ? banner.imageUrl.mobile : banner.imageUrl.desktop;
    }
    // Fallback to string imageUrl for backward compatibility
    return banner.imageUrl;
  };

  return (
    <div className="min-h-screen bg-white">
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
              <div className={`relative w-full h-full bg-gray-100`}>
                <img
                  src={getBannerImageUrl(banner)}
                  alt={banner.heading || `Banner ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Banner Navigation Dots */}
        {banners.length > 1 && (
          <div className={`absolute ${isMobile ? 'bottom-4' : 'bottom-6'} left-1/2 transform -translate-x-1/2 flex space-x-2`}>
            {banners.map((_, index) => (
              <button
                key={index}
                className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} rounded-full transition-colors duration-200 ${
                  currentBanner === index ? 'bg-white shadow-lg' : 'bg-gray-400 hover:bg-gray-300'
                }`}
                onClick={() => goToBanner(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-3 px-6 font-medium text-lg ${
              activeTab === 'shipping' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping Policy
          </button>
          <button
            className={`py-3 px-6 font-medium text-lg ${
              activeTab === 'returns' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('returns')}
          >
            Return Policy
          </button>
        </div>

        {/* Shipping Policy Content */}
        {activeTab === 'shipping' && (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <FaTruck className="text-3xl text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Shipping Policy</h2>
              </div>
              <p className="text-gray-700 mb-6">
                At GlowGlaz, we strive to deliver your products quickly and safely. Please review our shipping policies below for detailed information about delivery options, timeframes, and costs.
              </p>

              {/* Domestic Shipping Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  {shippingPolicy.domesticShipping.title}
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {shippingPolicy.domesticShipping.policies.map((policy, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                      <h4 className="font-bold text-lg mb-2 text-blue-700">{policy.title}</h4>
                      <p className="text-gray-700 mb-1">{policy.details}</p>
                      <p className="text-gray-700 mb-3">Delivery: <span className="font-medium">{policy.timeframe}</span></p>
                      <p className="text-sm text-gray-600 italic">{policy.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* International Shipping Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  {shippingPolicy.internationalShipping.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {shippingPolicy.internationalShipping.policies.map((policy, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                      <h4 className="font-bold text-lg mb-2 text-blue-700">{policy.title}</h4>
                      <p className="text-gray-700 mb-1">{policy.details}</p>
                      <p className="text-gray-700 mb-3">Delivery: <span className="font-medium">{policy.timeframe}</span></p>
                      <p className="text-sm text-gray-600 italic">{policy.note}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <h4 className="font-medium mb-2">International Shipping Restrictions</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {shippingPolicy.internationalShipping.restrictions.map((restriction, index) => (
                      <li key={index}>{restriction}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Processing Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  {shippingPolicy.orderProcessing.title}
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <ul className="space-y-2 text-gray-700">
                    {shippingPolicy.orderProcessing.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span> 
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Returns Policy Content */}
        {activeTab === 'returns' && (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <FaExchangeAlt className="text-3xl text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Return Policy</h2>
              </div>
              <p className="text-gray-700 mb-6">
                We want you to be completely satisfied with your purchase. If you're not entirely happy with your order, we're here to help you return or exchange it.
              </p>

              {/* Return Eligibility Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  {returnPolicy.eligibility.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h4 className="font-medium mb-3 text-green-700">Eligible Returns</h4>
                    <ul className="space-y-2 text-gray-700">
                      {returnPolicy.eligibility.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span> 
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h4 className="font-medium mb-3 text-red-700">Exceptions</h4>
                    <ul className="space-y-2 text-gray-700">
                      {returnPolicy.eligibility.exceptions.map((exception, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span> 
                          <span>{exception}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Return Process Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  {returnPolicy.process.title}
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <ol className="space-y-4 list-decimal list-inside text-gray-700">
                    {returnPolicy.process.steps.map((step, index) => (
                      <li key={index} className="pl-2">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Refunds Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  {returnPolicy.refunds.title}
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <ul className="space-y-2 text-gray-700">
                    {returnPolicy.refunds.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span> 
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Exchanges Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  {returnPolicy.exchanges.title}
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <ul className="space-y-2 text-gray-700">
                    {returnPolicy.exchanges.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span> 
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Frequently Asked Questions */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {shippingFaqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full text-left p-4 flex justify-between items-center bg-white"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <span>
                    {expandedFaqs[index] ? 
                      <FaChevronUp className="text-gray-500" /> : 
                      <FaChevronDown className="text-gray-500" />
                    }
                  </span>
                </button>
                
                {expandedFaqs[index] && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shipping;