/**
 * OrganizationSchema.jsx — Reusable JSON-LD Organization schema.
 *
 * Uses the organizationSchema utility from structuredData.js for consistent output.
 * Only includes verified social profiles. No fabricated business information.
 *
 * Import with custom data, or use buildOrganizationSchemaFromFooter() for
 * data derived from the Footer component's company info.
 */

import { organizationSchema, buildOrganizationSchemaFromFooter } from "../structuredData";
import { Helmet } from "react-helmet-async";

/**
 * Render organization schema with provided data.
 * @param {object} props - Optional overrides
 *   - siteName: string (default: "SystemaOps")
 *   - description: string (default: from company description)
 *   - url: string (default: BASE_URL)
 *   - logo: string (optional, absolute URL)
 *   - socialProfiles: array of { name, url } (optional, verified only)
 */
function OrganizationSchema({ 
  siteName, 
  description, 
  url, 
  logo, 
  socialProfiles 
}) {
  const schemaData = organizationSchema(
    siteName || "SystemaOps",
    description,
    url || "https://www.systemaops.com",
    logo,
    socialProfiles
  );

  if (!schemaData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}

/**
 * Build organization schema from Footer component data.
 * Uses real company data from the footer - never fabricated.
 */
OrganizationSchema.buildOrganizationSchemaFromFooter = 
  (companyName, companyDescription, contactEmail) =>
  buildOrganizationSchemaFromFooter(companyName, companyDescription, contactEmail);

export default OrganizationSchema;