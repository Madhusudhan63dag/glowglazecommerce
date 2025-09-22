import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateOrganizationSchema } from '../utils/seo/schemaGenerator';

/**
 * SEO component for managing all document head data
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.canonical - Canonical URL
 * @param {Object} props.meta - Additional meta tags
 * @param {boolean} props.noindex - Whether to add noindex meta tag
 * @param {Object} props.schema - JSON-LD schema data
 * @param {string} props.type - Page type (product, category, etc.)
 */
const SEO = ({ 
  title = 'GlowGlaz - Ayurvedic & Natural Health Products', 
  description = 'Discover authentic Ayurvedic and natural health products at GlowGlaz. Shop our range of herbal supplements, skincare, and wellness solutions.', 
  canonical = '',
  meta = {},
  noindex = false,
  schema = null,
  type = 'website'
}) => {
  const metaData = {
    ...meta,
    'og:title': title,
    'og:description': description,
    'og:type': type,
    'twitter:title': title,
    'twitter:description': description,
  };

  // Get base organization schema
  const baseSchema = generateOrganizationSchema();
  
  // Combine with provided schema if any
  const schemas = schema ? [baseSchema, schema] : [baseSchema];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Add canonical URL if provided */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Add noindex tag if specified */}
      {noindex && <meta name="robots" content="noindex" />}
      
      {/* Add JSON-LD Schema */}
      {schemas.map((schemaObj, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaObj)}
        </script>
      ))}
      
      {/* Add additional meta tags */}
      {Object.entries(metaData).map(([name, content]) => (
        name && content ? <meta key={name} property={name} content={content} /> : null
      ))}
    </Helmet>
  );
};

export default SEO;