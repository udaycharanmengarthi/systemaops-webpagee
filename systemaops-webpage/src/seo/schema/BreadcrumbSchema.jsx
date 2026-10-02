/**
 * BreadcrumbSchema.jsx — Reusable JSON-LD BreadcrumbList schema.
 *
 * Usage:
 *   import BreadcrumbSchema from '../seo/schema/BreadcrumbSchema';
 *   ...
 *   <BreadcrumbSchema
 *     items={[
 *       { name: 'Home', href: '/' },
 *       { name: 'Services', href: '/#services' },
 *       { name: 'AI Automation', href: '/ai-automation' },
 *     ]}
 *   />
 *
 * @param {Array} items - Array of { name: string, href: string }
 *   href values should be relative paths (e.g. '/about').
 *   They will be prefixed with the base URL automatically.
 *   They must correspond exactly to the visible page hierarchy.
 */

import { breadcrumbsSchema } from "../structuredData";

export default function BreadcrumbSchema({ items = [] }) {
  // Filter items that have both name and href
  const validItems = items.filter(
    item => item && item.name && item.href
  );

  if (validItems.length === 0) return null;

  // Use the breadcrumbsSchema utility for consistent output
  const schemaData = breadcrumbsSchema(validItems);

  if (!schemaData) return null;

  return (
    <script type="application/ld+json">
      {JSON.stringify(schemaData)}
    </script>
  );
}