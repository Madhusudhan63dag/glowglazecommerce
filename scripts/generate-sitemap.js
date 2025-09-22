const fs = require('fs');
const path = require('path');
const { generateSitemap } = require('../src/utils/seo/sitemapGenerator');
const products = require('./product-urls.js');

// Generate sitemap
const sitemap = generateSitemap(products);

// Write to public folder
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'sitemap.xml'),
  sitemap,
  'utf8'
);

console.log('Sitemap generated successfully!');