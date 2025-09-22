const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'GlowGlaz',
    'url': 'https://glowglaz.com',
    'logo': 'https://glowglaz.com/logo.png', // Update with actual logo URL
    'sameAs': [
      'https://facebook.com/glowglaz',
      'https://instagram.com/glowglaz',
      // Add other social media URLs
    ]
  };
};

const generateProductSchema = (product) => {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.title,
    'image': product.images[0], // Assuming first image is the main image
    'description': product.description,
    'sku': product.id.toString(),
    'brand': {
      '@type': 'Brand',
      'name': 'GlowGlaz'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://glowglaz.com/product/${product.id}`,
      'priceCurrency': 'INR',
      'price': product.price,
      'availability': product.inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'GlowGlaz'
      }
    },
    // Add aggregate rating if available
    ...(product.rating && {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product.rating,
        'reviewCount': product.reviewCount || 0
      }
    })
  };
};

const generateBreadcrumbSchema = (product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://glowglaz.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': product?.category || 'Products',
        'item': `https://glowglaz.com/${product?.category?.toLowerCase() || 'products'}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product?.title,
        'item': `https://glowglaz.com/product/${product?.id}`
      }
    ]
  };
};

export {
  generateOrganizationSchema,
  generateProductSchema,
  generateBreadcrumbSchema
};