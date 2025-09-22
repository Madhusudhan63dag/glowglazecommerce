const BASE_URL = 'https://glowglaz.com'; // Replace with your actual domain

const generateSitemap = (products) => {
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
  const productUrls = products.map(product => `/product/${product.id}`);

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

module.exports = {
  generateSitemap
};