import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import productData from '../utils/data/product';
import { useCart } from '../context/CartContext';

const DealsPage = () => {
  const { dealType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [sortOption, setSortOption] = useState('default');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Get deal data from the centralized product data
  const dealMap = productData.dealsData;
  
  // Get current deal info
  const currentDeal = dealMap[dealType] || null;
  
  // Get banners for current deal
  const banners = currentDeal?.banners || [
    {
      id: 1,
      imageUrl: "https://placehold.co/1920x400/f5f5f5/757575?text=Deal+Not+Found",
      heading: "Deal Not Available",
      subheading: "Please check our other offers"
    }
  ];
  
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

  // Filter products based on the deal type
  const filteredProducts = useMemo(() => {
    if (!currentDeal) {
      return [];
    }
    
    return productData.productDetailData.filter(product => 
      currentDeal.productIds.includes(product.id)
    );
  }, [currentDeal]);

  // Handle navigation to product page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle navigation to bundle offer page for PSORIGO
  const handleBundleClick = () => {
    if (dealType === 'psorigo') {
      navigate('/offers');
    }
  };

  const handleAddToCart = (product, event) => {
    event.stopPropagation();
    
    // Calculate discounted price (remove non-numeric characters from price string)
    const originalPrice = parseFloat(product.price.replace(/[^\d.]/g, ''));
    const discount = currentDeal.discount.replace(/[^\d.]/g, '') / 100;
    const discountedPrice = originalPrice * (1 - discount);
    
    addToCart({
      id: product.id,
      title: product.title,
      price: discountedPrice,
      image: product.images[0]
    });
  };

  if (!currentDeal) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Deal Not Found</h2>
          <p className="text-gray-600 mb-6">The deal you're looking for is not available.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section - Replacing the previous gradient header */}
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

      <div className="container mx-auto py-8 px-4">
        {/* Bundle Special Case */}
        {currentDeal.isBundle && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleBundleClick}>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 text-center mb-4 md:mb-0">
                <div className="text-3xl font-bold text-green-600">{currentDeal.bundlePrice}</div>
                <div className="text-gray-500 line-through">{currentDeal.originalPrice}</div>
              </div>
              <div className="md:w-3/4 md:pl-6">
                <h3 className="text-xl font-bold mb-2">Complete Bundle Offer</h3>
                <p className="text-gray-600 mb-4">
                  Get all three PSORIGO products at an exclusive bundle price. Click for more details.
                </p>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBundleClick();
                  }}
                >
                  View Bundle Deal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="w-full h-48 object-contain"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {currentDeal.discount}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.whyLoveIt.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">{product.price}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
