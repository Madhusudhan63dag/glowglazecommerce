import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaChevronUp, FaTruck, FaBox, FaExchangeAlt, FaCreditCard } from 'react-icons/fa';
import productData from '../utils/data/product';
import {faqBanner} from '../utils/data/banner';
import SEO from '../components/SEO';

const Faq = () => {
  const location = useLocation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const categoryRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  
  // Get banners from product data
  const banners = faqBanner;
  const faqData = productData.faqData;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveCategory(faqData[0]?.category || null);
    setFilteredFaqs(faqData);
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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredFaqs(faqData);
      return;
    }
    
    // Filter FAQs based on search term
    const filtered = faqData.map(category => {
      return {
        ...category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(term) || 
               q.answer.toLowerCase().includes(term)
        )
      };
    }).filter(category => category.questions.length > 0);
    
    setFilteredFaqs(filtered);
    
    // Expand all matching questions
    const newExpandedState = {};
    filtered.forEach(category => {
      category.questions.forEach(question => {
        newExpandedState[question.id] = true;
      });
    });
    setExpandedQuestions(newExpandedState);
  };

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectCategory = (category) => {
    setActiveCategory(category);
    
    // Find the category reference and scroll to it
    const categoryIndex = faqData.findIndex(cat => cat.category === category);
    if (categoryRefs.current[categoryIndex]) {
      categoryRefs.current[categoryIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Get icon based on category
  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'Package': return <FaBox />;
      case 'Truck': return <FaTruck />;
      case 'RefreshCw': return <FaExchangeAlt />;
      case 'CreditCard': return <FaCreditCard />;
      default: return <FaBox />;
    }
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
      <SEO 
        title="Frequently Asked Questions - GlowGlaz"
        description="Find answers to common questions about GlowGlaz products, shipping, returns, and more. Get the information you need about our natural Ayurvedic health solutions."
        canonical="https://glowglaz.com/faq"
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

      {/* Search Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">How can we help you?</h2>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for questions or topics..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-3 px-5 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>

      {/* FAQ Categories & Questions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Category Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b">FAQ Categories</h3>
                <ul className="space-y-2">
                  {faqData.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => selectCategory(category.category)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeCategory === category.category
                            ? `bg-${category.color}-100 text-${category.color}-700`
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-${category.color}-600`}>
                            {getCategoryIcon(category.icon)}
                          </span>
                          {category.category}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Questions */}
            <div className="md:w-3/4">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-gray-600">
                    We couldn't find any FAQ matching your search. Please try different keywords or browse categories.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((category, categoryIndex) => (
                  <div 
                    key={categoryIndex} 
                    ref={el => categoryRefs.current[categoryIndex] = el}
                    className="mb-10"
                  >
                    <div className={`flex items-center gap-3 mb-4 bg-${category.color}-50 p-4 rounded-lg`}>
                      <span className={`text-${category.color}-600 text-xl`}>
                        {getCategoryIcon(category.icon)}
                      </span>
                      <h3 className={`text-xl font-bold text-${category.color}-700`}>{category.category}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <div 
                          key={faq.id} 
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                          <button
                            className="w-full text-left p-4 flex justify-between items-center"
                            onClick={() => toggleQuestion(faq.id)}
                          >
                            <h4 className="font-medium text-lg">{faq.question}</h4>
                            <span>
                              {expandedQuestions[faq.id] ? 
                                <FaChevronUp className="text-gray-500" /> : 
                                <FaChevronDown className="text-gray-500" />
                              }
                            </span>
                          </button>
                          
                          {expandedQuestions[faq.id] && (
                            <div className="p-4 pt-0 bg-gray-50 border-t border-gray-200">
                              <p className="text-gray-700">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6">Still Have Questions?</h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Please contact our friendly support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@glowglaz.com" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Contact Support
            </a>
            <a 
              href="/contact" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium"
            >
              Visit Contact Page
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
