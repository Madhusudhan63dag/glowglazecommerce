import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShippingFast, FaStar } from 'react-icons/fa';
import productData from '../utils/data/product';
import { useCart } from '../context/CartContext';

const Offer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Get PSORIGO products
  const psorigoOil = productData.productDetailData.find(p => p.id === 6);
  const psorigoLotion = productData.productDetailData.find(p => p.id === 4);
  const psorigoWash = productData.productDetailData.find(p => p.id === 5);

  const originalPrice = 4497; // ₹1,499 × 3
  const offerPrice = 3599;
  const saving = originalPrice - offerPrice;
  const savingPercentage = Math.round((saving / originalPrice) * 100);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddBundleToCart = () => {
    // Add the bundle as a single item
    addToCart({
      id: 'psorigo-bundle',
      title: 'PSORIGO Complete Skin Care Bundle',
      price: offerPrice,
      image: "https://placehold.co/600x400/e0f2f1/00897b?text=PSORIGO+Bundle"
    }, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-green-600 to-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold">SPECIAL BUNDLE OFFER</h1>
          <p className="text-lg">Limited Time Only!</p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Offer Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Add Bundle Image - New Section */}
            <div className="lg:w-1/3 mb-6 lg:mb-0">
              <div className="relative">
                <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">
                  SAVE {savingPercentage}%
                </div>
                {/* Main bundle image showing all products together */}
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  <img 
                    src="https://placehold.co/600x400/e0f2f1/00897b?text=PSORIGO+Bundle" 
                    alt="PSORIGO Complete Skin Care Bundle" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              {/* Product preview thumbnails */}
              <div className="flex justify-center mt-4 gap-2">
                <img src={psorigoOil.images[0]} alt="PSORIGO Oil" className="w-16 h-16 object-cover rounded border-2 border-green-500" />
                <img src={psorigoLotion.images[0]} alt="PSORIGO Lotion" className="w-16 h-16 object-cover rounded border-2 border-blue-500" />
                <img src={psorigoWash.images[0]} alt="PSORIGO Wash" className="w-16 h-16 object-cover rounded border-2 border-purple-500" />
              </div>
            </div>

            <div className="lg:w-2/5">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">PSORIGO Complete Skin Care Bundle</h2>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <span className="ml-2 text-gray-600">(42 Reviews)</span>
              </div>
              <p className="text-gray-600 mb-6">
                The complete PSORIGO skin care solution for psoriasis-prone skin. This bundle includes 
                three of our bestselling products designed to cleanse, moisturize, and treat 
                irritated skin. Experience the full benefits of our dermatologist-approved formula.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> 
                  <span>Deep moisturization for itchy, flaky skin</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> 
                  <span>Soothes irritation and reduces redness</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> 
                  <span>100% natural herbal ingredients</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> 
                  <span>Paraben-free and dermatologically tested</span>
                </li>
              </ul>
            </div>

            <div className="lg:w-1/4">
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 line-through">₹4,497</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">SAVE {savingPercentage}%</span>
                </div>
                <div className="text-3xl font-bold mb-6">₹3,599</div>
                
                <div className="flex items-center mb-6">
                  <label htmlFor="quantity" className="mr-4 font-medium">Quantity:</label>
                  <div className="flex border border-gray-300 rounded">
                    <button 
                      className="px-3 py-2 border-r border-gray-300"
                      onClick={decrementQuantity}
                    >
                      -
                    </button>
                    <input 
                      id="quantity" 
                      type="number" 
                      className="w-12 text-center outline-none" 
                      value={quantity} 
                      readOnly 
                    />
                    <button 
                      className="px-3 py-2 border-l border-gray-300"
                      onClick={incrementQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium w-full mb-4"
                  onClick={handleAddBundleToCart}
                >
                  Add Bundle to Cart
                </button>

                <div className="flex items-center justify-center text-gray-600 text-sm">
                  <FaShippingFast className="mr-2" />
                  <span>Free shipping on orders over ₹3,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Products - update with better images */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 text-center">What's Included in This Bundle</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* PSORIGO Oil */}
            <div className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleProductClick(6)}>
              <div className="h-48 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-2">
                <img 
                  src={psorigoOil.images[0]} 
                  alt={psorigoOil.title} 
                  className="h-40 object-contain transition-transform hover:scale-110 duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold mb-2">{psorigoOil.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{psorigoOil.whyLoveIt.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{psorigoOil.price}</span>
                  <span className="text-sm text-blue-600 hover:underline">View Details</span>
                </div>
              </div>
            </div>

            {/* PSORIGO Body Lotion */}
            <div className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleProductClick(4)}>
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-2">
                <img 
                  src={psorigoLotion.images[0]} 
                  alt={psorigoLotion.title} 
                  className="h-40 object-contain transition-transform hover:scale-110 duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold mb-2">{psorigoLotion.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{psorigoLotion.whyLoveIt.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{psorigoLotion.price}</span>
                  <span className="text-sm text-blue-600 hover:underline">View Details</span>
                </div>
              </div>
            </div>

            {/* PSORIGO Body Wash */}
            <div className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleProductClick(5)}>
              <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-2">
                <img 
                  src={psorigoWash.images[0]} 
                  alt={psorigoWash.title} 
                  className="h-40 object-contain transition-transform hover:scale-110 duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold mb-2">{psorigoWash.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{psorigoWash.whyLoveIt.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{psorigoWash.price}</span>
                  <span className="text-sm text-blue-600 hover:underline">View Details</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Product Gallery Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 text-center">See the Bundle in Action</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
              <img src={psorigoOil.images[1]} alt="PSORIGO Oil in use" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
              <img src={psorigoLotion.images[1]} alt="PSORIGO Lotion application" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
              <img src={psorigoWash.images[2]} alt="PSORIGO Wash in shower" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="aspect-square bg-gray-100 rounded overflow-hidden">
              <img src={psorigoOil.images[3]} alt="PSORIGO results" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Bundle Benefits */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-6 text-center">Why Choose This Bundle</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 className="font-bold mb-2">Save ₹898</h4>
              <p className="text-gray-600">Get all three products at a discounted price compared to buying them separately.</p>
            </div>

            <div className="text-center p-4">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h4 className="font-bold mb-2">Complete Care Routine</h4>
              <p className="text-gray-600">A comprehensive skincare system designed to work together for maximum effectiveness.</p>
            </div>

            <div className="text-center p-4">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h4 className="font-bold mb-2">Fast Results</h4>
              <p className="text-gray-600">Experience noticeable improvements in skin health in as little as 2 weeks of consistent use.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-center">Frequently Asked Questions</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-2">How long will this bundle offer last?</h4>
              <p className="text-gray-600">This is a limited time offer and may end without notice. We recommend taking advantage of it while supplies last.</p>
            </div>

            <div>
              <h4 className="font-bold mb-2">How should I use these products together?</h4>
              <p className="text-gray-600">For best results, use the Body Wash during your shower, apply the Body Lotion after bathing, and use the Oil on specific problem areas as needed throughout the day.</p>
            </div>

            <div>
              <h4 className="font-bold mb-2">Are these products suitable for sensitive skin?</h4>
              <p className="text-gray-600">Yes, all PSORIGO products are formulated for sensitive, psoriasis-prone skin and are dermatologically tested.</p>
            </div>

            <div>
              <h4 className="font-bold mb-2">Can I return individual products from the bundle?</h4>
              <p className="text-gray-600">The bundle is sold as a complete set. If you're not satisfied, you can return the entire bundle within 30 days of purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;