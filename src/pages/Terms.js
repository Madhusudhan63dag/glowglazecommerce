import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFileContract, FaGavel, FaBalanceScale, FaClipboard, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import productData from '../utils/data/product';

const Terms = () => {
  const location = useLocation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  // Get data from product.js
  const banners = productData.termsBanner;
  const termsData = productData.termsAndConditions;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Initialize all sections as expanded
    const initialExpandedState = {};
    termsData.sections.forEach((section) => {
      initialExpandedState[section.id] = true;
    });
    setExpandedSections(initialExpandedState);
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

    termsData.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      termsData.sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [termsData.sections]);

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
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Get section icon based on section ID
  const getSectionIcon = (sectionId) => {
    switch(sectionId) {
      case 'acceptance':
        return <FaFileContract className="text-2xl text-gray-700" />;
      case 'intellectual':
        return <FaGavel className="text-2xl text-gray-700" />;
      case 'liability':
      case 'disclaimer':
        return <FaBalanceScale className="text-2xl text-gray-700" />;
      default:
        return (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
            <p className="text-gray-500">Last updated: {termsData.lastUpdated}</p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700">{termsData.introduction.content}</p>
          </div>

          {/* Table of Contents on desktop */}
          <div className="hidden md:block bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaClipboard className="mr-2 text-gray-600" />
              Table of Contents
            </h2>
            <ul className="grid grid-cols-2 gap-2">
              {termsData.sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left w-full px-2 py-1 rounded hover:bg-gray-200 ${
                      activeSection === section.id ? 'font-medium text-gray-800 bg-gray-200' : ''
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {termsData.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <div 
                  className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-600">
                      {getSectionIcon(section.id)}
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  <div>
                    {expandedSections[section.id] ? (
                      <FaChevronUp className="text-gray-500" />
                    ) : (
                      <FaChevronDown className="text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedSections[section.id] && (
                  <div className="pl-6 pr-4 py-4 space-y-4">
                    {section.content && <p className="text-gray-700">{section.content}</p>}

                    {/* Points */}
                    {section.points && section.points.length > 0 && (
                      <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                        {section.points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    )}

                    {/* Bullets */}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-5 space-y-1 text-gray-700">
                        {section.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {/* Subsections */}
                    {section.subsections && section.subsections.length > 0 && (
                      <div className="space-y-4 mt-4">
                        {section.subsections.map((subsection, index) => (
                          <div key={index} className="bg-gray-50 border-l-4 border-gray-300 p-4">
                            <h3 className="font-bold text-lg mb-2">{subsection.title}</h3>
                            <p className="text-gray-700">{subsection.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Legal Note */}
                    {section.legalNote && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-gray-700 italic">
                        <p>{section.legalNote}</p>
                      </div>
                    )}

                    {/* Legal Text */}
                    {section.legalText && (
                      <div className="bg-gray-50 p-4 text-sm text-gray-700">
                        <p>{section.legalText}</p>
                      </div>
                    )}

                    {/* Contact Details */}
                    {section.contactDetails && (
                      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-md">
                        <p className="mb-2">
                          <strong>Email:</strong>{" "}
                          <a href={`mailto:${section.contactDetails.email}`} className="text-blue-600 hover:underline">
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
                )}
              </section>
            ))}
          </div>

          {/* Final Note */}
          <div className="mt-12 border-t border-gray-200 pt-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Questions About Our Terms & Conditions?</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions, please contact our legal team at{" "}
                <a href="mailto:legal@glowglaz.com" className="text-blue-600 hover:underline">
                  legal@glowglaz.com
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

export default Terms;
