const generateCategorySchema = (category, products = []) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${category.name} - GlowGlaz`,
    'description': category.description,
    'url': `https://glowglaz.com/category/${category.slug}`,
    'hasPart': products.map((product, index) => ({
      '@type': 'Product',
      'position': index + 1,
      'name': product.title,
      'description': product.description,
      'image': product.images[0],
      'url': `https://glowglaz.com/product/${product.id}`,
      'offers': {
        '@type': 'Offer',
        'price': product.price,
        'priceCurrency': 'INR',
        'availability': product.inStock 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock'
      }
    }))
  };
};

const generateCategoryBreadcrumbSchema = (category) => {
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
        'name': 'Categories',
        'item': 'https://glowglaz.com/categories'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': category.name,
        'item': `https://glowglaz.com/category/${category.slug}`
      }
    ]
  };
};

export { generateCategorySchema, generateCategoryBreadcrumbSchema };