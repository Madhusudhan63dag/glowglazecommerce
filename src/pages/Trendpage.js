import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaShoppingCart } from 'react-icons/fa';
import productData from '../utils/data/product';
import { useCart } from '../context/CartContext';
import { trendingBanner } from "../utils/data/banner";


const Trendpage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animationPhase, setAnimationPhase] = useState('idle');
  const [prevBanner, setPrevBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const [filterVisible, setFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  
  // Load all products when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load all products by default
    const allProducts = productData.trendingpage.reduce((acc, category) => {
      return [...acc, ...category.products];
    }, []);
    
    // Remove duplicates by ID
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );
    
    setProducts(uniqueProducts);
    setFilteredProducts(uniqueProducts);
  }, []);
  
  // Update filtered products when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      // Show all products
      const allProducts = productData.trendingpage.reduce((acc, category) => {
        return [...acc, ...category.products];
      }, []);
      
      // Remove duplicates by ID
      const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex(p => p.id === product.id)
      );
      
      setProducts(uniqueProducts);
      setSelectedCategoryData(null);
    } else {
      // Find category in trendingpage data
      const categoryData = productData.trendingpage.find(cat => 
        cat.title.toLowerCase().replace(' ', '-') === activeCategory
      );
      
      if (categoryData) {
        setSelectedCategoryData(categoryData);
        setProducts(categoryData.products);
      }
    }
  }, [activeCategory]);
  
  // Apply filters when products, search term, price range, or sort order changes
  useEffect(() => {
    handleFilterChange();
  }, [products, searchTerm, priceRange, sortOrder]);
  
  // Get banners from selected category or default banners
  const banners = trendingBanner;
  
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

  // Update to handle category selection without navigation
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };
  
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  
  const handleFilterChange = () => {
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOrder) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product, event) => {
    event.stopPropagation(); // Prevent navigation to product page
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.url
    });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    ...productData.trendingpage.map(cat => ({
      value: cat.title.toLowerCase().replace(' ', '-'),
      label: cat.title
    }))
  ];
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

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-gray-500 breadcrumbs">
          <ul className="flex">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><span className="mx-2">/</span></li>
            <li className="hover:text-blue-600">Trending</li>
            {activeCategory !== 'all' && (
              <>
                <li><span className="mx-2">/</span></li>
                <li className="font-medium text-gray-700 capitalize">
                  {activeCategory.replace('-', ' ')}
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar/Filters for Desktop */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2 mb-8">
                {categories.map(category => (
                  <li key={category.value}>
                    <button
                      onClick={() => handleCategorySelect(category.value)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        activeCategory === category.value
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.label}
                    </button>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-lg font-bold mb-4">Price Range</h3>
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </aside>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden sticky top-0 z-10 bg-white shadow-sm mb-4 p-3">
            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
            >
              <FaFilter className="mr-2" /> {filterVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {filterVisible && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map(category => (
                    <button
                      key={category.value}
                      onClick={() => handleCategorySelect(category.value)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeCategory === category.value
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
                
                <h3 className="text-lg font-bold mb-2">Price Range</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
                <h1 className="text-2xl font-bold">
                  {selectedCategoryData ? selectedCategoryData.title : 'All Trending Products'}
                </h1>
                
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Sort by</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
              
              {selectedCategoryData && (
                <p className="text-gray-700 mb-6">{selectedCategoryData.description}</p>
              )}
              
              {/* Products count */}
              <p className="text-sm text-gray-500 mb-4">Showing {filteredProducts.length} products</p>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="h-48 overflow-hidden cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img 
                        src={product.url} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 
                        className="font-bold text-lg mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.title}
                      </h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                      </div>
                      <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPriceRange([0, 5000]);
                      setSortOrder('default');
                      setActiveCategory('all');
                    }}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Trendpage;