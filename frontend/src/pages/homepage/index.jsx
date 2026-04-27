import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import BannerShowcase from './components/BannerShowcase';
import FeaturedProductsSection from './components/FeaturedProductsSection';

import ShopByCategorySection from './components/ShopByCategorySection';
import CategoryProductsSection from './components/CategoryProductsSection';
import EssentialOilsSection from './components/EssentialOilsSection';
import EdibleOilsSection from './components/EdibleOilsSection';
import ExperienceTraditionCTA from './components/ExperienceTraditionCTA';


import NewsletterSection from './components/NewsletterSection';
import TrustCertificates from '../../components/TrustCertificates';
import Footer from './components/Footer';

import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Homepage = () => {
  const { addToCart, getCartItemCount, cartItems } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock cart data for demonstration
  useEffect(() => {
    const mockCartItems = [
      {
        id: 1,
        name: "Traditional Mysore Pak",
        price: 399,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop",
        variant: "250g",
        quantity: 2
      },
      {
        id: 2,
        name: "Homemade Mango Pickle",
        price: 280,
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
        variant: "500g",
        quantity: 1
      }
    ];
    // The original code had setCartItems(mockCartItems) here which would be incorrect if CartContext doesn't manage initial state this way.
    // Assuming addToCart handles adding items and the context maintains the state.
    // If initial cart state is needed, it should be handled within CartContext.
  }, []);

  const handleAddToCart = (product) => {
    // If product has a selectedVariantId, use that variant
    let variant = null;
    if (product.selectedVariantId && product.variants) {
      variant = product.variants.find(v => v.id === product.selectedVariantId);
    } else if (product.variants && product.variants.length > 0) {
      variant = product.variants[0];
    }
    const cartItem = {
      id: variant ? `${product.id}-${variant.id}` : `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: variant ? variant.price : (product.salePrice || product.price),
      originalPrice: variant ? variant.originalPrice : (product.originalPrice || product.price),
      image: product.image,
      variant: variant ? (variant.label || variant.weightValue + (variant.weightUnit || '')) : 'Default',
      category: product.category,
      brand: product.brand,
      variantId: variant ? variant.id : undefined,
      weightValue: variant ? variant.weightValue : undefined,
      weightUnit: variant ? variant.weightUnit : undefined,
      stockQuantity: variant ? variant.stockQuantity : product.stockQuantity
    };
    addToCart(cartItem, 1);
    console.log('Added to cart:', cartItem);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Navigate to product collection with search query
    window.location.href = `/product-collection-grid?search=${encodeURIComponent(query)}`;
  };

  return (
    <>
      <Helmet>
        <title>Sanatana Parampare - Buy Premium Traditional Indian Food Products Online</title>
        <meta
          name="description"
          content="Shop premium traditional Indian food products online at Sanatana Parampare. Buy wood-pressed oils, spice powders, pickles, pure ghee, honey & more. Free delivery above ₹499. Authentic quality guaranteed."
        />
        <meta name="keywords" content="buy traditional indian food online, wood pressed oils, spice powders, pickles, pure ghee, honey, jaggery, papads, organic food products, sanatana parampare shop, traditional food delivery" />
        <meta property="og:title" content="Sanatana Parampare - Buy Premium Traditional Indian Food Products Online" />
        <meta property="og:description" content="Shop premium traditional Indian food products online. Wood-pressed oils, spice powders, pickles, pure ghee & more with free delivery above ₹499." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sanatanaparampare.com/homepage" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sanatana Parampare - Buy Traditional Indian Food Online" />
        <meta name="twitter:description" content="Shop premium traditional Indian food products online. Wood-pressed oils, spice powders, pickles, pure ghee & more with free delivery." />
        <link rel="canonical" href="https://sanatanaparampare.com/homepage" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header
          cartItemCount={getCartItemCount()}
          isLoggedIn={!!user}
          onSearch={handleSearch}
          cartItems={cartItems}
        />

        {/* Main Content */}
        <main>
          {/* Hero Section - Product-focused slider with shopping CTAs */}
          <HeroSection />

          {/* Essential Oils Section - Pure traditional oils */}
          <EssentialOilsSection />

          {/* Edible Oils Section - New section with special oils */}
          <EdibleOilsSection />
          {/* Shop by Category - Browse all product categories */}
          <ShopByCategorySection />
          {/* New Category-Based Product Section */}
          <CategoryProductsSection onAddToCart={handleAddToCart} />
          {/* Experience Tradition CTA */}
          <ExperienceTraditionCTA />


          {/* Featured Products - Best selling items with quick purchase */}
          <FeaturedProductsSection onAddToCart={handleAddToCart} />

          {/* Banner Showcase - Featured banner images and categories */}
          <BannerShowcase />

          {/* Newsletter Section */}
          <NewsletterSection />

          {/* Trust Certificates Section */}
          <TrustCertificates />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Homepage;