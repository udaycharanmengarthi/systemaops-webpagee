/**
 * BlogSchema.jsx — Reusable JSON-LD BlogPosting schema.
 *
 * Usage:
 *   import BlogSchema from '../seo/schema/BlogSchema';
 *   ...
 *   <BlogSchema
 *     title="Blog Post Title"
 *     description="Post excerpt..."
 *     slug="blog-post-slug"
 *     datePublished="2025-01-01"
 *     dateModified="2025-01-15"
 *     authorName="Author Name"
 *     image="https://www.systemaops.com/blog/image.png"
 *   />
 */

import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.systemaops.com";

export default function BlogSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  // TODO: Replace with verified author name once available.
  authorName = "SystemaOps Team",
  image,
}) {
  if (!title || !slug) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || "",
    url: `${BASE_URL}/blog/${slug}`,
    datePublished: datePublished || "",
    dateModified: dateModified || datePublished || "",
    image: image || `${BASE_URL}/og-image.png`,
    author: {
      "@type": "Organization",
      name: authorName,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SystemaOps",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
