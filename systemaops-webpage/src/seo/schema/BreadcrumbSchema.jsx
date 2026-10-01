/**
 * BreadcrumbSchema.jsx — Reusable JSON-LD BreadcrumbList schema.
 *
 * Usage:
 *   import BreadcrumbSchema from '../seo/schema/BreadcrumbSchema';
 *   ...
 *   <BreadcrumbSchema
 *     items={[
 *       { name: 'Home', href: '/' },
 *       { name: 'Blog', href: '/blogs' },
 *       { name: 'Post Title', href: '/blog/post-slug' },
 *     ]}
 *   />
 *
 * @param {Array} items - Array of { name: string, href: string }
 *   href values should be relative paths (e.g. '/about').
 *   They will be prefixed with the base URL automatically.
 */

import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.systemaops.com";

export default function BreadcrumbSchema({ items = [] }) {
  if (!items.length) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, href }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${BASE_URL}${href}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
