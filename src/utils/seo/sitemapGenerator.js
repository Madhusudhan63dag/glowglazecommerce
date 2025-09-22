import productData from '../data/product';

const BASE_URL = 'https://glowglaz.com'; // Replace with your actual domain

const generateSitemap = () => {
  const today = new Date().toISOString();
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/shipping'
  ];

  // Generate product URLs
  const productUrls = productData.productDetailData.map(product => `/product/${product.id}`);

  // Combine all URLs
  const allUrls = [...staticRoutes, ...productUrls];

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const generateSitemapAndSave = async () => {
  try {
    const sitemap = generateSitemap();
    
    // In a real application, you would save this to your public folder
    // This could be done during build time or through an API endpoint
    // For now, we'll just return the sitemap string
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};

export default generateSitemap;