/**
 * FAQSchema.jsx — Reusable JSON-LD FAQPage schema.
 *
 * Usage:
 *   import FAQSchema from '../seo/schema/FAQSchema';
 *   ...
 *   <FAQSchema faqs={faqsArray} />
 *
 * @param {Array} faqs - Array of { question: string, answer: string }
 */

import { Helmet } from "react-helmet-async";

export default function FAQSchema({ faqs = [] }) {
  if (!faqs.length) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
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
