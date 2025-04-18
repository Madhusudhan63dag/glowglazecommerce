import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FaHeart, FaFacebookF, FaTwitter, FaPinterestP, FaGoogle } from 'react-icons/fa';
import productData from '../utils/data/product';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  // Scroll to top when component mounts or when product id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, id]);
  
  useEffect(() => {
    // Find the product by ID
    const foundProduct = productData.productDetailData.find(
      (p) => p.id === parseInt(id)
    );
    setProduct(foundProduct);
  }, [id]);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addToCart({ 
        id: product.id, 
        title: product.title, 
        price: parseFloat(product.price.replace(/[^\d.]/g, '')), // Convert price string to number
        images: product.images,
      }, quantity);
    }
  };

  if (!product) {
    return <div className="container mx-auto py-10 text-center">Loading product...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="container mx-auto py-6 px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-2 w-20">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`border rounded-md cursor-pointer ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`Product thumbnail ${index + 1}`} className="w-full h-auto" />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative">
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded">{product.badge}</span>
                  </div>
                )}
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.title} 
                  className="w-full h-auto border rounded-lg"
                />

                {/* Mobile thumbnails */}
                <div className="flex md:hidden gap-2 mt-4 justify-center">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`border w-16 rounded-md cursor-pointer ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`Product thumbnail ${index + 1}`} className="w-full h-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
            
            {/* Price */}
            <div className="mb-6">
              <span className="text-2xl font-bold">{product.price}</span>
            </div>
            
            {/* Quantity Selector and Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
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
                className={`${
                  product.inStock 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white py-3 px-6 rounded-md font-medium w-full`}
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            {/* Share */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Share:</span>
                <button className="text-gray-500 hover:text-red-500"><FaHeart /></button>
                <button className="text-gray-500 hover:text-blue-600"><FaFacebookF /></button>
                <button className="text-gray-500 hover:text-blue-400"><FaTwitter /></button>
                <button className="text-gray-500 hover:text-red-600"><FaPinterestP /></button>
                <button className="text-gray-500 hover:text-red-500"><FaGoogle /></button>
              </div>
            </div>
            
            {/* Description and Ingredients */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">WHY YOU'LL LOVE IT</h3>
                  <p className="text-gray-700">
                    {product.whyLoveIt}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3">INGREDIENTS</h3>
                  <p className="text-gray-700">
                    {product.ingredients}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        {product.values && product.values.length > 0 && (
          <div className="mt-12 py-8 bg-gray-50 rounded-lg">
            <h3 className="text-center font-bold text-xl mb-8">Product Values</h3>
            <div className="grid grid-cols-3 max-w-2xl mx-auto text-center">
              {product.values.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3`}>
                    <img src={value.img}  />
                  </div>
                  <span className="font-medium">{value.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;
