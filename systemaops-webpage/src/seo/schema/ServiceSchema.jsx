/**
 * ServiceSchema.jsx — Reusable JSON-LD Service schema.
 *
 * Uses the serviceSchema utility from structuredData.js for consistent output.
 * All values come from actual page metadata — no invented capabilities.
 */

import { serviceSchema } from "../structuredData";
import { Helmet } from "react-helmet-async";

export default function ServiceSchema({ name, description, url }) {
  const schemaData = serviceSchema(name, description, url);

  if (!schemaData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}