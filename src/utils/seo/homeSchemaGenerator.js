const generateWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'GlowGlaz',
    'url': 'https://glowglaz.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://glowglaz.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

const generateHomePageSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Featured Products',
        'url': 'https://glowglaz.com/#featured'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'New Arrivals',
        'url': 'https://glowglaz.com/#new-arrivals'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'Top Brands',
        'url': 'https://glowglaz.com/#brands'
      }
    ]
  };
};

export { generateWebsiteSchema, generateHomePageSchema };