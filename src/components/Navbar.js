import React, { useState, useRef, useEffect } from 'react'
import { Menu, Search, Youtube, ShoppingCart, Box, X } from 'lucide-react'
import logo from '../utils/image/navbar_logo.png'
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
      navigate(`/trending?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSuggestions(false);
      setShowMobileSearch(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    navigate(`/trending?search=${encodeURIComponent(suggestion.title.trim())}`);
    setSearchTerm('');
    setShowSuggestions(false);
    setShowMobileSearch(false);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  return (
    <header className="sticky top-0 w-full z-50">
      {/* Top Bar */}
      <div className="w-full bg-[#37abc8] py-2 px-4">
        <div className="container mx-auto flex justify-center items-center relative">
          <div className="flex items-center gap-2 text-white">
            <Box size={20} className="hidden sm:block" />
            <p className="font-extrabold text-xs sm:text-base text-center">FREE SHIPPING on orders over $59!</p>
          </div>
          <button className="text-white font-bold text-xs sm:text-sm hover:opacity-80 absolute right-2 sm:right-0">
            Français
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="py-2 sm:py-4 px-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className='flex items-center gap-2 sm:gap-4'>
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden flex items-center text-[#37abc8]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              {/* Desktop Menu Button */}
              <div className="hidden lg:block relative" ref={dropdownRef}>
                <button 
                  className="flex items-center text-[#37abc8]"
                  onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
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
                <div className="flex items-center gap-2">
                  <a href='/' className="flex items-center">
                  <img src={logo} alt="NaturaMarket" className="h-12 sm:h-16 lg:h-20" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right - Search & Icons */}
            <div className="flex items-center gap-2 sm:gap-3 mr-20">
              {/* Search Bar */}
              <div className="relative hidden md:flex items-center border border-gray-200 rounded-xl">
                <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search entire store here..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-[200px] lg:w-[300px] px-4 py-2 text-sm rounded-2xl"
                  />
                  <button 
                    type="submit" 
                    className="p-2 text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-xl absolute right-0"
                  >
                    <Search size={30} />
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
                          <div className="w-10 h-10 mr-2">
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
                className="md:hidden p-2 text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-full"
                onClick={toggleMobileSearch}
              >
                <Search size={30} />
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-1.5 sm:p-2 text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-full sm:rounded-2xl">
                <a href='https://www.youtube.com/@glowglaze' target="_blank" rel="noopener noreferrer">
                  <Youtube size={30} className="" />
                </a>
                </button>
                {/* Add cart button with item count */}
                <button 
                  onClick={toggleCart}
                  className="relative inline-flex items-center p-2 text-sm font-medium text-center text-white bg-green-600 hover:bg-white hover:text-green-600 rounded-full focus:outline-none">
                  <ShoppingCart size={30} className="" />
                  {cartItemCount > 0 && (
                    <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
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
        <div className="lg:hidden bg-white p-4 shadow-md">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search entire store here..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-l-full text-sm"
              autoFocus
            />
            <button 
              type="submit" 
              className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-r-full"
            >
              <Search size={24} />
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
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 pt-20">
          <div className="container mx-auto px-4">
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
                  <Search size={24} />
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
                <ul className="space-y-2">
                  {navbar.map(item => (
                    <li key={item.id} className="border-b border-gray-200 pb-2">
                      <a href={item.link} className="text-gray-800 font-medium block py-2">
                        {item.name}
                      </a>
                      <ul className="ml-4 space-y-1">
                        {item.subItems && item.subItems.slice(0, 5).map(subItem => (
                          <li key={subItem.id}>
                            <a href={subItem.link} className="text-gray-600 block py-1">
                              {subItem.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
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