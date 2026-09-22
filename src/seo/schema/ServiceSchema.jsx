/**
 * ServiceSchema.jsx — Reusable JSON-LD Service schema.
 *
 * Usage:
 *   import ServiceSchema from '../seo/schema/ServiceSchema';
 *   ...
 *   <ServiceSchema
 *     name="Odoo Customization"
 *     description="Custom Odoo ERP development and integration..."
 *     url="/odoo-customization"
 *   />
 *
 * @param {string} name        - Service name (required)
 * @param {string} description - Service description
 * @param {string} url         - Relative URL path for this service page
 *
 * TODO: Add areaServed, serviceType, and pricing once confirmed.
 */

import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.systemaops.com";

export default function ServiceSchema({ name, description, url }) {
  if (!name) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: description || "",
    url: url ? `${BASE_URL}${url}` : BASE_URL,
    provider: {
      "@type": "Organization",
      name: "SystemaOps",
      url: BASE_URL,
    },
    // TODO: Add areaServed, serviceType, and pricing once confirmed.
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
