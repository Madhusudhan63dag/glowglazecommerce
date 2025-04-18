import React, { useState, useEffect, useRef, useMemo } from 'react';
import Card from '../components/Card';
import Card2 from '../components/Card2';
import Card4 from '../components/Card4';
import productData from '../utils/data/product';
import { useLocation, useNavigate } from 'react-router-dom';

const Trending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategoryParam = queryParams.get('category');
  const searchQuery = queryParams.get('search');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryParam || 'all');
  const [sortOption, setSortOption] = useState('default');
  
  const trending = productData.trending;
  const allProducts = productData.productData;
  const trendingPageData = productData.trendingpage;
  
  const selectedTrendingData = selectedCategoryParam 
    ? trendingPageData.find(item => item.title.toLowerCase().replace(' ', '-') === selectedCategoryParam)
    : null;
  
  const banners = selectedTrendingData?.banner || [
    {
      id: 1,
      imageUrl: "https://placehold.co/1920x400/222222/FFFFFF/png?text=Trending+Products",
      heading: "Discover What's Hot",
      subheading: "Explore our most popular health and wellness products"
    },
    {
      id: 2,
      imageUrl: "https://placehold.co/1920x400/003366/FFFFFF/png?text=Best+Sellers",
      heading: "Customer Favorites",
      subheading: "The products our customers love the most"
    }
  ];

  const featuredProductsRef = useRef(null);
  const [featuredPosition, setFeaturedPosition] = useState(0);
  
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
  
  const scrollLeftFeatured = () => {
    if (featuredProductsRef.current) {
      const containerWidth = featuredProductsRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8;
      featuredProductsRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        const scrollPosition = featuredProductsRef.current.scrollLeft;
        const maxScroll = featuredProductsRef.current.scrollWidth - featuredProductsRef.current.clientWidth;
        const position = Math.round((scrollPosition / maxScroll) * (allProducts.length / 3 - 1));
        setFeaturedPosition(position);
      }, 300);
    }
  };

  const scrollRightFeatured = () => {
    if (featuredProductsRef.current) {
      const containerWidth = featuredProductsRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.8;
      featuredProductsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        const scrollPosition = featuredProductsRef.current.scrollLeft;
        const maxScroll = featuredProductsRef.current.scrollWidth - featuredProductsRef.current.clientWidth;
        const position = Math.round((scrollPosition / maxScroll) * (allProducts.length / 3 - 1));
        setFeaturedPosition(position);
      }, 300);
    }
  };

  const filteredProducts = useMemo(() => {
    let products = [];
    
    if (selectedTrendingData) {
      products = selectedTrendingData.products;
    } else if (selectedCategory === 'all') {
      products = allProducts;
    } else {
      products = allProducts.filter(product => {
        const productTitle = product.title.toLowerCase();
        const productFeatures = product.features 
          ? product.features.map(f => f.title.toLowerCase()).join(' ')
          : '';
          
        return productTitle.includes(selectedCategory.toLowerCase()) ||
               productFeatures.includes(selectedCategory.toLowerCase());
      });
    }
    
    // Apply search filter if search query exists
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      return products.filter(product => {
        const title = product.title.toLowerCase();
        const description = product.description ? product.description.toLowerCase() : '';
        const features = product.features 
          ? product.features.map(f => f.title.toLowerCase()).join(' ')
          : '';
        
        return title.includes(searchTerm) || 
               description.includes(searchTerm) || 
               features.includes(searchTerm);
      });
    }
    
    return products;
  }, [selectedTrendingData, selectedCategory, allProducts, searchQuery]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  const categories = useMemo(() => {
    const baseCategories = [
      { id: 'all', name: 'All Products' },
      ...trendingPageData.map(category => ({
        id: category.title.toLowerCase().replace(' ', '-'),
        name: category.title
      })),
      { id: 'joints', name: 'Joint Health' },
      { id: 'slim', name: 'Weight Management' },
      { id: 'psorigo', name: 'Skin Care' }
    ];

    return Array.from(
      new Map(baseCategories.map(item => [item.id, item])).values()
    );
  }, [trendingPageData]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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
                className="relative w-full h-[300px] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                <div className="text-center text-white">
                </div>
              </div>
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

      {!selectedTrendingData && (
        <section className="container mx-auto py-10">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Categories</h2>
          <div className="flex justify-center gap-5 flex-wrap">
            {trending.map((card, index) => (
              <Card key={index} card={card} />
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8">
          {searchQuery 
            ? `Search Results for "${searchQuery}"`
            : selectedTrendingData 
              ? `${selectedTrendingData.title} Products` 
              : "All Trending Products"
          }
        </h2>
        
        <div className="flex flex-wrap justify-between items-center mb-6 px-4">
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-md py-1 px-2"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        {selectedTrendingData && (
          <div className="px-4 mb-6">
            <p className="text-gray-700">{selectedTrendingData.description}</p>
          </div>
        )}
        
        {/* Enhanced Ayurvedic benefits section */}
        {selectedTrendingData && selectedTrendingData.benefits && (
          <div className="px-4 mb-10">
            <div className="relative bg-gradient-to-r from-green-50 to-blue-50 rounded-xl overflow-hidden border border-gray-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -mr-32 -mt-32 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full -ml-32 -mb-32 opacity-20"></div>
              
              <div className="relative z-10 p-8">
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  {selectedTrendingData.benefits.title}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {selectedTrendingData.benefits.points.map((point, index) => {
                    // Map benefit titles to relevant images
                    const imageMap = {
                      "100% Natural Power": "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                      "Backed by Science": "https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                      "Total Body Support": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                      "Stops Fat Before It Starts": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                    };
                    
                    const imageUrl = imageMap[point.title] || `https://source.unsplash.com/300x300/?${encodeURIComponent(point.title.toLowerCase())}`;
                    
                    return (
                      <div 
                        key={index} 
                        className="flex bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex-shrink-0 mr-5">
                          <div className="w-24 h-24 rounded-lg overflow-hidden">
                            <img 
                              src={imageUrl} 
                              alt={point.title}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-lg mb-2 text-green-800">{point.title}</h4>
                          <p className="text-gray-700 leading-relaxed">{point.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 text-center">
                  <a href='/about'>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md font-medium">
                    Know More About Us
                  </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!selectedTrendingData && selectedCategory !== 'all' && (
          <div className="px-4 mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {categories.find(cat => cat.id === selectedCategory)?.name}
            </h3>
            <p className="text-gray-700">
              Showing all products in the {categories.find(cat => cat.id === selectedCategory)?.name.toLowerCase()} category.
            </p>
          </div>
        )}
        
        {searchQuery && filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-700 mb-4">No products found matching "{searchQuery}"</p>
            <button 
              onClick={() => navigate('/trending')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              View All Products
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {sortedProducts.map((product, index) => (
            <div 
              key={index} 
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => handleProductClick(product.id)}
            >
              <div className="bg-white p-4">
                <div className="mb-4 aspect-square overflow-hidden">
                  <img 
                    src={product.imageUrl || product.url} 
                    alt={product.title} 
                    className="w-full h-full object-contain transition-transform hover:scale-105"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">₹{product.price}</span>
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Trending;