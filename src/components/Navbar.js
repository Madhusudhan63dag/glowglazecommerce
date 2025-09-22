import React, { useState, useRef, useEffect } from 'react'
import { Menu, Search, Youtube, ShoppingCart, Box, X } from 'lucide-react'
import logo from '../utils/image/navbar_logo.png'
import logo_mob from '../utils/image/navbar_mob.jpg'
import navbar from '../utils/data/navbar.js'
import { useCart } from '../context/CartContext';
import MiniCart from './MiniCart';
import { useNavigate } from 'react-router-dom';
import productData from '../utils/data/product';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const { cartItemCount, toggleCart } = useCart();

  // Get all products for search suggestions
  const allProducts = [];
  productData.trendingpage.forEach(category => {
    category.products.forEach(product => {
      if (!allProducts.some(p => p.id === product.id)) {
        allProducts.push(product);
      }
    });
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDesktopMenuOpen(false);
      }
      
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 1) {
      // Filter products to get suggestions
      const suggestions = allProducts
        .filter(product => 
          product.title.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // If we have suggestions and exact match, navigate to the product
      const exactMatch = searchSuggestions.find(
        product => product.title.toLowerCase() === searchTerm.trim().toLowerCase()
      );
      if (exactMatch) {
        navigate(`/product/${exactMatch.id}`);
      } else {
        // If no exact match, go to search results
        navigate(`/trending?search=${encodeURIComponent(searchTerm.trim())}`);
      }
      setSearchTerm('');
      setShowSuggestions(false);
      setShowMobileSearch(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion.id}`);
    setSearchTerm('');
    setShowSuggestions(false);
    setShowMobileSearch(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-50">
      {/* Top Bar */}
      <div className="w-full bg-[#37abc8] py-1 sm:py-2 px-2 sm:px-4">
        <div className="container mx-auto flex justify-center items-center flex-wrap relative">
          <div className="flex items-center gap-1 sm:gap-2 text-white">
            <p className="font-extrabold text-[10px] xs:text-xs sm:text-sm md:text-base text-center flex">
              Subscribe to our &nbsp;<a className='text-red-600 cursor-pointer' href="https://www.youtube.com/@glowglaz"> YouTube &nbsp;</a><a className='hidden md:block'> — Because your health deserves more than the usual.</a>
            </p>
          </div>
          <a 
            href='https://www.youtube.com/@glowglaz' 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-bold text-[8px] xs:text-xs sm:text-sm absolute right-1 sm:right-0 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md bg-gradient-to-r from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:via-red-500 hover:to-red-600 text-white animate-pulse transition-all duration-500 shadow-md"
          >
            Subscribe
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="py-1 sm:py-2 md:py-0 px-2 sm:px-4">
          <div className="flex items-center justify-between gap-1 sm:gap-4">
            <div className='flex items-center gap-1 sm:gap-4'>
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden flex items-center text-[#37abc8]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7" /> : <Menu size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />}
              </button>

              {/* Desktop Menu Button */}
              <div className="hidden lg:block relative" ref={dropdownRef}>
                <button 
                  className="flex items-center text-[#37abc8]"
                  onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <Menu size={40} />
                  <div className="flex flex-col ml-2">
                    <span className="text-md font-semibold leading-tight">Main</span>
                    <span className="text-md font-semibold leading-tight">Menu</span>
                  </div>
                </button>
                
                {/* Desktop Mega Dropdown Menu */}
                <div 
                  className={`absolute w-[96vw] top-full left-0 mt-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 
                    transition-all duration-300 ease-in-out transform origin-top 
                    ${isDesktopMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
                >
                  <div className="flex">
                    {/* Main Categories - Left Side */}
                    <div className="w-1/4 border-r bg-[#DEF5FA] border-gray-200">
                      <ul className="py-4">
                        {navbar.map((category, index) => (
                          <li key={category.id} className="relative group">
                            <a 
                              href={category.link}
                              className="block px-6 py-3 text-2xl font-bold hover:underline hover:translate-x-[10px] underline-offset-1 hover:text-[#37abc8] text-black transition duration-150 transform"
                              onMouseEnter={() => {
                                const allSubmenus = document.querySelectorAll('.submenu');
                                allSubmenus.forEach(menu => menu.classList.add('hidden'));
                                document.getElementById(`submenu-${category.id}`).classList.remove('hidden');
                              }}
                            >
                              {category.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Subcategories - Right Side */}
                    <div className="w-3/4 p-6">
                      {navbar.map((category, index) => (
                        <div 
                          id={`submenu-${category.id}`}
                          key={`submenu-${category.id}`}
                          className={`submenu ${index === 0 ? '' : 'hidden'}`}
                        >
                          <div className="grid grid-cols-3 gap-4 transition-all duration-500 ease-in-out transform origin-top">
                            {category.subItems.map((item) => (
                              <a 
                                key={item.id} 
                                href={item.link}
                                className="text-gray-700 hover:text-[#37abc8] transition duration-500 block py-2"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Logo */}
              <div className="flex flex-col items-center">
                <a href='/' className="flex items-center">
                  <img src={logo} alt="NaturaMarket" className="h-8 sm:h-12 md:h-16 lg:h-20 md:block hidden" />
                  <img src={logo_mob} alt="NaturaMarket" className="h-12 md:hidden block " />
                </a>
              </div>
            </div>

            {/* Right - Search & Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search Bar */}
              <div className="relative hidden md:flex items-center border border-gray-200 rounded-xl">
                <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Find your next favorite item..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-[180px] lg:w-[300px] px-4 py-2 text-sm rounded-2xl"
                  />
                  <button 
                    type="submit" 
                    className="p-2 text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-xl absolute right-0"
                  >
                    <Search size={24} className="lg:w-6 lg:h-6" />
                  </button>
                </form>
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                  >
                    <ul>
                      {searchSuggestions.map((suggestion, index) => (
                        <li 
                          key={suggestion.id || index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        >
                          <div className="w-8 h-8 mr-2">
                            <img 
                              src={suggestion.url || suggestion.imageUrl} 
                              alt={suggestion.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm font-medium">{suggestion.title}</span>
                            <span className="block text-xs text-gray-500">₹{suggestion.price}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Mobile Search Button */}
              <button 
                className="md:hidden p-1 sm:p-1.5 text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-full"
                onClick={toggleMobileSearch}
                aria-label="Search"
              >
                <Search size={20} className="sm:w-5 sm:h-5" />
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button 
                  className="p-1 sm:p-1.5 md:p-2 text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-full sm:rounded-2xl"
                  aria-label="YouTube Channel"
                >
                  <a href='https://www.youtube.com/@glowglaz' target="_blank" rel="noopener noreferrer">
                    <Youtube size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </a>
                </button>
                
                {/* Add cart button with item count */}
                <button 
                  onClick={toggleCart}
                  className="relative inline-flex items-center p-1 sm:p-1.5 md:p-2 text-sm font-medium text-center text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-full focus:outline-none"
                  aria-label={`Shopping cart with ${cartItemCount} items`}
                >
                  <ShoppingCart size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {cartItemCount > 0 && (
                    <div className="absolute inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                      {cartItemCount}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (shown when mobile search button is clicked) */}
      {showMobileSearch && (
        <div className="md:hidden bg-white p-2 sm:p-3 shadow-md">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search entire store here..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 px-2 sm:px-4 py-1 sm:py-2 border border-gray-200 rounded-l-full text-xs sm:text-sm"
              autoFocus
            />
            <button 
              type="submit" 
              className="p-1 sm:p-2 text-white bg-green-600 hover:bg-green-700 rounded-r-full"
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>
            
            {/* Mobile Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div 
                className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                <ul>
                  {searchSuggestions.map((suggestion, index) => (
                    <li 
                      key={suggestion.id || index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-2 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    >
                      <div className="w-8 h-8 mr-2">
                        <img 
                          src={suggestion.url || suggestion.imageUrl} 
                          alt={suggestion.title} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs sm:text-sm">{suggestion.title}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 flex justify-between items-center bg-white p-4 border-b border-gray-200 shadow-sm">
            <a href="/">
              <img src={logo} alt="NaturaMarket" className="h-8 sm:h-10" />
            </a>
            <button 
              onClick={closeMobileMenu}
              className="p-1 text-gray-700 hover:bg-gray-100 rounded-full"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                <input
                  type="text"
                  placeholder="Search entire store here..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-l-full text-sm"
                />
                <button 
                  type="submit" 
                  className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-r-full"
                >
                  <Search size={20} />
                </button>
                
                {/* Mobile Menu Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                  >
                    <ul>
                      {searchSuggestions.map((suggestion, index) => (
                        <li 
                          key={suggestion.id || index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        >
                          <div className="w-8 h-8 mr-2">
                            <img 
                              src={suggestion.url || suggestion.imageUrl} 
                              alt={suggestion.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="block text-sm">{suggestion.title}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
              
              {/* Mobile menu navigation */}
              <div className="mt-4">
                <h2 className="text-lg font-bold mb-2">Shop Categories</h2>
                {navbar.map(item => (
                  <div key={item.id} className="mb-4 border-b border-gray-200 pb-2">
                    <a href={item.link} className="text-gray-800 font-medium text-lg block py-2">
                      {item.name}
                    </a>
                    <ul className="grid grid-cols-2 gap-1 ml-2">
                      {item.subItems && item.subItems.map(subItem => (
                        <li key={subItem.id}>
                          <a 
                            href={subItem.link} 
                            className="text-gray-600 text-sm block py-1.5 hover:text-[#37abc8]"
                            onClick={closeMobileMenu}
                          >
                            {subItem.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://www.youtube.com/@glowglaz" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center p-2 bg-red-600 text-white rounded-full"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add the MiniCart component at the end of the Navbar component */}
      <MiniCart />
    </header>
  )
}

export default Navbar