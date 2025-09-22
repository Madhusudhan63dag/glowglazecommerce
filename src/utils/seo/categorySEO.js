import { generateCategorySchema, generateCategoryBreadcrumbSchema } from './categorySchemaGenerator';

export const getCategorySEOProps = (category, products = []) => {
  if (!category) return null;

  return {
    title: `${category.name} - GlowGlaz Ayurvedic Products`,
    description: `Shop ${category.name} at GlowGlaz. Browse our collection of ${category.name.toLowerCase()} products including ${products.slice(0, 3).map(p => p.title).join(', ')} and more.`,
    canonical: `https://glowglaz.com/category/${category.slug}`,
    type: 'website',
    schema: {
      '@graph': [
        generateCategorySchema(category, products),
        generateCategoryBreadcrumbSchema(category)
      ]
    },
    meta: {
      'og:type': 'website',
      'og:title': `${category.name} - GlowGlaz Ayurvedic Products`,
      'og:description': `Explore our collection of ${category.name.toLowerCase()} products at GlowGlaz`,
      'og:image': products[0]?.images[0] || '%PUBLIC_URL%/og-image.jpg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'keywords': `${category.name}, Ayurvedic products, natural health, ${category.keywords || ''}, GlowGlaz`,
    }
  };
};