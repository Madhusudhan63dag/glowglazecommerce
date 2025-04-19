import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaShieldAlt, FaUserLock, FaCookieBite, FaChevronDown, FaChevronUp, FaClipboard } from 'react-icons/fa';
import SEO from '../components/SEO';
import productData from '../utils/data/product';

const Privacy = () => {
  const location = useLocation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Get data from product.js
  const banners = productData.privacyBanner;
  const privacyPolicy = productData.privacyPolicy;

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

  // Intersection Observer to highlight active section in table of contents
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    privacyPolicy.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      privacyPolicy.sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [privacyPolicy.sections]);

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Adjust this value as needed
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Privacy Policy - GlowGlaz"
        description="Learn how GlowGlaz protects your personal information and privacy. View our comprehensive privacy policy and data protection practices."
        canonical="https://glowglaz.com/privacy"
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: {privacyPolicy.lastUpdated}</p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700">{privacyPolicy.introduction.content}</p>
          </div>

          {/* Table of Contents on desktop */}
          <div className="hidden md:block bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaClipboard className="mr-2 text-indigo-600" />
              Table of Contents
            </h2>
            <ul className="space-y-2">
              {privacyPolicy.sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left w-full px-2 py-1 rounded hover:bg-gray-200 ${
                      activeSection === section.id ? 'font-medium text-indigo-600 bg-indigo-50' : ''
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {privacyPolicy.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-indigo-600">
                    {section.id === 'information' && <FaUserLock className="text-2xl" />}
                    {section.id === 'security' && <FaShieldAlt className="text-2xl" />}
                    {section.id === 'cookies' && <FaCookieBite className="text-2xl" />}
                    {section.id !== 'information' && section.id !== 'security' && section.id !== 'cookies' && (
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>

                <div className="pl-10 space-y-4">
                  {section.content && <p className="text-gray-700">{section.content}</p>}

                  {/* Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-4 mt-4">
                      {section.subsections.map((subsection, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h3 className="font-bold text-lg mb-2">{subsection.title}</h3>
                          <p className="text-gray-700">{subsection.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bullet Points */}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      {section.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {/* Cookie Types */}
                  {section.cookieTypes && section.cookieTypes.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.cookieTypes.map((cookieType, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-bold mb-2">{cookieType.name}</h4>
                          <p className="text-gray-700 text-sm">{cookieType.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* User Rights */}
                  {section.rights && section.rights.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.rights.map((right, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-bold mb-2">{right.name}</h4>
                          <p className="text-gray-700 text-sm">{right.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Security Points */}
                  {section.additionalPoints && section.additionalPoints.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      {section.additionalPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}

                  {/* Contact Details */}
                  {section.contactDetails && (
                    <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
                      <p className="mb-2">
                        <strong>Email:</strong>{" "}
                        <a href={`mailto:${section.contactDetails.email}`} className="text-indigo-600 hover:underline">
                          {section.contactDetails.email}
                        </a>
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {section.contactDetails.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {section.contactDetails.address}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Final Note */}
          <div className="mt-12 border-t border-gray-200 pt-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Questions About Our Privacy Practices?</h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact our Data Protection Officer at{" "}
                <a href="mailto:privacy@glowglaz.com" className="text-indigo-600 hover:underline">
                  privacy@glowglaz.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
