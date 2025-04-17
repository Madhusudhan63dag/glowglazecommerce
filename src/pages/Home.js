import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Card2 from '../components/Card2';
import Card3 from '../components/Card3';
import images from '../utils/data/icons';
import Card4 from '../components/Card4';
import productData from '../utils/data/product';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  const cards8 = [1, 2, 3, 4, 5, 6, 7, 8];
  const trending = productData.trending;
  const newproduct = productData.newproduct;
  const brand = productData.brand;
  const itemOfWeekProducts = productData.productData;

  const newCardsRef = useRef(null);
  const dietCardsRef = useRef(null);
  const brandCardsRef = useRef(null);
  const itemOfWeekRef = useRef(null);

  const [newCardsPosition, setNewCardsPosition] = useState(0);
  const [itemOfWeekPosition, setItemOfWeekPosition] = useState(0);

  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleTrendingCardClick = (card, event) => {
    if (event) {
      event.preventDefault();
    }
    navigate(`/trending?category=${card.name.toLowerCase().replace(' ', '-')}`);
  };

  const handleBrandClick = (brand, event) => {
    if (event) {
      event.preventDefault();
    }
    
    const brandToDealMap = {
      "Sampoorn Arogya": "sampoorn-arogya",
      "Dr. Joints": "dr-joints",
      "Beyondslim": "beyondslim",
      "PSORIGO": "psorigo"
    };
    
    const dealRoute = brandToDealMap[brand.name.trim()];
    
    if (dealRoute) {
      navigate(`/deals/${dealRoute}`);
    }
  };

  const banners = [
    {
      id: 1,
      imageUrl: "https://placehold.co/1920x600/222222/FFFFFF/png?text=Banner+1",
    },
    {
      id: 2,
      imageUrl: "https://placehold.co/1920x600/003366/FFFFFF/png?text=Banner+2",
    },
    {
      id: 3,
      imageUrl: "https://placehold.co/1920x600/660033/FFFFFF/png?text=Banner+3",
    },
    {
      id: 4,
      imageUrl: "https://placehold.co/1920x600/336600/FFFFFF/png?text=Banner+4",
    }
  ];

  useEffect(() => {
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

  const scrollLeftNew = () => {
    if (newCardsRef.current) {
      const containerWidth = newCardsRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8;
      newCardsRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        const scrollPosition = newCardsRef.current.scrollLeft;
        const maxScroll = newCardsRef.current.scrollWidth - newCardsRef.current.clientWidth;
        const position = Math.round((scrollPosition / maxScroll) * (cards8.length / 4 - 1));
        setNewCardsPosition(position);
      }, 300);
    }
  };

  const scrollRightNew = () => {
    if (newCardsRef.current) {
      const containerWidth = newCardsRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8;
      newCardsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        const scrollPosition = newCardsRef.current.scrollLeft;
        const maxScroll = newCardsRef.current.scrollWidth - newCardsRef.current.clientWidth;
        const position = Math.round((scrollPosition / maxScroll) * (cards8.length / 4 - 1));
        setNewCardsPosition(position);
      }, 300);
    }
  };

  const scrollLeftNew_Two = () => {
    if (itemOfWeekRef.current) {
      const containerWidth = itemOfWeekRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8;
      itemOfWeekRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        const scrollPosition = itemOfWeekRef.current.scrollLeft;
        const maxScroll = itemOfWeekRef.current.scrollWidth - itemOfWeekRef.current.clientWidth;
        const position = Math.round((scrollPosition / maxScroll) * (cards8.length / 4 - 1));
        setItemOfWeekPosition(position);
      }, 300);
    }
  };

  const scrollRightNew_Two = () => {
    if (itemOfWeekRef.current) {
      const containerWidth = itemOfWeekRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8;
      itemOfWeekRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        const scrollPosition = itemOfWeekRef.current.scrollLeft;
        const maxScroll = itemOfWeekRef.current.scrollWidth - itemOfWeekRef.current.clientWidth;
        const position = Math.round((scrollPosition / maxScroll) * (cards8.length / 4 - 1));
        setItemOfWeekPosition(position);
      }, 300);
    }
  };

  const handleNewCardsScroll = () => {
    if (newCardsRef.current) {
      const scrollPosition = newCardsRef.current.scrollLeft;
      const maxScroll = newCardsRef.current.scrollWidth - newCardsRef.current.clientWidth;
      const position = Math.round((scrollPosition / maxScroll) * (cards8.length / 4 - 1));
      setNewCardsPosition(position);
    }
  };

  const handleItemOfWeekScroll = () => {
    if (itemOfWeekRef.current) {
      const scrollPosition = itemOfWeekRef.current.scrollLeft;
      const maxScroll = itemOfWeekRef.current.scrollWidth - itemOfWeekRef.current.clientWidth;
      const position = Math.round((scrollPosition / maxScroll) * (cards8.length / 4 - 1));
      setItemOfWeekPosition(position);
    }
  };

  useEffect(() => {
    const newCardsElement = newCardsRef.current;
    if (newCardsElement) {
      newCardsElement.addEventListener('scroll', handleNewCardsScroll);
    }
    return () => {
      if (newCardsElement) {
        newCardsElement.removeEventListener('scroll', handleNewCardsScroll);
      }
    };
  }, []);

  useEffect(() => {
    const itemOfWeekElement = itemOfWeekRef.current;
    if (itemOfWeekElement) {
      itemOfWeekElement.addEventListener('scroll', handleItemOfWeekScroll);
    }
    return () => {
      if (itemOfWeekElement) {
        itemOfWeekElement.removeEventListener('scroll', handleItemOfWeekScroll);
      }
    };
  }, [itemOfWeekRef.current]);

  const scrollLeftDiet = () => {
    if (dietCardsRef.current) {
      dietCardsRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRightDiet = () => {
    if (dietCardsRef.current) {
      dietCardsRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const scrollLeftBrand = () => {
    if (brandCardsRef.current) {
      brandCardsRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRightBrand = () => {
    if (brandCardsRef.current) {
      brandCardsRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
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
                className="relative w-full h-[500px] bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              ></div>
            </div>
          ))}
        </div>

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
      </section>
      {/* trending section */}
      <section className="container mx-auto py-10">
        <h1 className="text-center font-bold text-4xl">Trending Now</h1>
        <div className="flex justify-center gap-5 flex-wrap">
          {trending.map((card, index) => (
            <div key={index} onClick={(e) => handleTrendingCardClick(card, e)} className="cursor-pointer">
              <Card key={index} card={card} />
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto py-10 relative">
        <h1 className="text-center font-bold text-4xl mb-6">What's New</h1>

        <div className="absolute top-1/2 left-0 z-10 w-full flex justify-between px-4">
          <button
            onClick={scrollLeftNew}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRightNew}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          ref={newCardsRef}
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide px-4 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {newproduct.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-center transition-all duration-300 cursor-pointer"
              style={{
                width: 'calc(25% - 15px)',
                minWidth: '220px',
                borderRadius: '8px'
              }}
              onClick={() => handleProductClick(card.id)}
            >
              <Card2 card={card} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(cards8.length / 4) }).map((_, index) => (
            <button
              key={index}
              className={`w-8 h-2 rounded-full ${newCardsPosition === index ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => {
                if (newCardsRef.current) {
                  const scrollAmount = (newCardsRef.current.scrollWidth / Math.ceil(cards8.length / 4)) * index;
                  newCardsRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                  setNewCardsPosition(index);
                }
              }}
              aria-label={`Go to card group ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto py-10 relative">
        <h1 className="text-center font-bold text-4xl mb-6">Global Standards, Trusted Quality</h1>

        <div className="absolute top-1/2 left-0 z-10 w-full flex justify-between px-4">
          <button
            onClick={scrollLeftDiet}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRightDiet}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          ref={dietCardsRef}
          className="flex overflow-x-auto pb-6 scrollbar-hide px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory'
          }}
        >
          {images.map((card, index) => (
            <div
              key={index}
              className={`flex-shrink-0 snap-center transition-all duration-300 ${index < 4 ? 'scale-100' : 'scale-95 opacity-90'}`}
              style={{
                width: 'calc(20% - 15px)',
                minWidth: '120px',
                borderRadius: '8px'
              }}
            >
              <div className={`${index < 4 ? 'relative overflow-visible' : ''}`}>
                <Card3 card={card} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {[0, 1].map((group) => (
            <button
              key={group}
              className={`w-8 h-2 rounded-full ${group === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => {
                if (dietCardsRef.current) {
                  dietCardsRef.current.scrollTo({ left: group * 1100, behavior: 'smooth' });
                }
              }}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto py-10 relative">
        <h1 className="text-center font-bold text-4xl mb-6">Shop by Brand</h1>

        <div className="absolute top-1/2 left-0 z-10 w-full flex justify-between px-4">
          <button
            onClick={scrollLeftBrand}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRightBrand}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          ref={brandCardsRef}
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory'
          }}
        > 
          {brand.map((card, index) => (
            <div
              key={index}
              className={`flex-shrink-0 snap-center transition-all duration-300 ${index < 4 ? 'scale-100' : 'scale-95 opacity-90'} cursor-pointer`}
              style={{
                width: 'calc(25% - 15px)',
                minWidth: '220px',
                borderRadius: '8px'
              }}
              onClick={(e) => handleBrandClick(card, e)}
            >
              <div className={`${index < 4 ? 'relative overflow-visible' : ''}`}>
                <Card card={card} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto py-10 relative">
        <h1 className="font-bold text-4xl text-center pb-10">Item of the Week</h1>
        <div className="absolute top-1/2 left-0 z-10 w-full flex justify-between px-4">
          <button
            onClick={scrollLeftNew_Two}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRightNew_Two}
            className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          ref={itemOfWeekRef}
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide px-4 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {itemOfWeekProducts.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-center transition-all duration-300 cursor-pointer"
              style={{
                width: '100%',
                minWidth: '220px',
                borderRadius: '8px'
              }}
              onClick={() => handleProductClick(product.id)}
            >
              <Card4 product={product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(itemOfWeekProducts.length / 4) }).map((_, index) => (
            <button
              key={index}
              className={`w-8 h-2 rounded-full ${itemOfWeekPosition === index ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => {
                if (itemOfWeekRef.current) {
                  const scrollAmount = (itemOfWeekRef.current.scrollWidth / Math.ceil(itemOfWeekProducts.length / 4)) * index;
                  itemOfWeekRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                  setItemOfWeekPosition(index);
                }
              }}
              aria-label={`Go to card group ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;


