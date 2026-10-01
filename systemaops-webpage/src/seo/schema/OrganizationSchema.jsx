/**
 * OrganizationSchema.jsx — Reusable JSON-LD Organization schema.
 *
 * Usage (in a page component):
 *   import OrganizationSchema from '../seo/schema/OrganizationSchema';
 *   ...
 *   <OrganizationSchema />
 *
 * TODO: Fill in sameAs, logo, and contactPoint with real verified data.
 * DO NOT fabricate any business information.
 */

import { Helmet } from "react-helmet-async";

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SystemaOps",
  url: "https://www.systemaops.com",
  // TODO: Replace with actual logo URL once available.
  logo: "https://www.systemaops.com/favicon.svg",
  email: "info@systemaops.com",
  // TODO: Add verified social profile URLs.
  sameAs: [
    "https://www.linkedin.com/company/107682944/",
    "https://www.instagram.com/systemaops",
    "https://x.com/SystemaOpsTech",
    "https://www.facebook.com/profile.php?id=61580745634197",
    "https://www.youtube.com/@SystemaOps-ai",
  ],
  // TODO: Add address details if applicable.
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
};

export default function OrganizationSchema() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
    </Helmet>
  );
}
