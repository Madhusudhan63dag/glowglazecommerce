import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import Trending from './pages/Trending';
import ProductPage from './pages/ProductPage';
import Offer from './pages/Offer';
import DealsPage from './pages/DealsPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Checkout from './pages/Checkout';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Trendpage from './pages/Trendpage';
import Shipping from './pages/Shipping';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Auth from './components/Auth';

// Import Cart Context
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/trendproduct" element={<Trendpage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/offers" element={<Offer />} />
              <Route path="/deals/:dealType" element={<DealsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/shipping" element={<Auth />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* Add other routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
