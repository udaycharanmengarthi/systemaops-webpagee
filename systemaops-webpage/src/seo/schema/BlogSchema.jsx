/**
 * BlogSchema.jsx — Reusable JSON-LD BlogPosting schema.
 *
 * Uses the articleSchema utility from structuredData.js for consistent output.
 * Only includes fields that actually exist in the blog data.
 * TODO: Replace with verified author name once available.
 */

import { articleSchema } from "../structuredData";
import { Helmet } from "react-helmet-async";

export default function BlogSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  authorName = "SystemaOps Team",
  image,
}) {
  // Build the article data object for the utility
  const articleData = {
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: authorName,
  };

  // If we have a publisher, add it
  // (the articleSchema utility will include it if provided in the right shape)

  const schemaData = articleSchema(articleData);

  if (!schemaData) return null;

  // Add publisher information that articleSchema may not include
  const enhancedSchemaData = {
    ...schemaData,
    publisher: {
      "@type": "Organization",
      name: "SystemaOps",
      url: "https://www.systemaops.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blog/${slug}`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(enhancedSchemaData)}
      </script>
    </Helmet>
  );
}