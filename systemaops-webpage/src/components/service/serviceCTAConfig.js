/**
 * components/service/serviceCTAConfig.js
 *
 * Single source of truth for the per-service CTA orbit diagram.
 * Pages call buildCTADiagram(t, serviceId) and pass the result
 * to <PremiumCTA diagram={...} />. Labels resolve through the
 * existing i18n system, so every service stays translated in
 * EN / NL / DE with no duplicated markup.
 */

export const CTA_SERVICE_IDS = [
  "ai",
  "odoo",
  "workflow",
  "devops",
  "consulting",
  "integration",
];

/* ServiceVisual variant per service id. "data" (Data & Document
   Automation, a workflow capability) reuses the linear chain. */
const CTA_VISUAL_VARIANTS = {
  ai: "ai-pipeline",
  odoo: "odoo-hub",
  workflow: "workflow-graph",
  devops: "aiops-dashboard",
  consulting: "consulting-roadmap",
  integration: "integration-mesh",
  data: "doc-chain",
};

export function buildCTADiagram(t, serviceId) {
  const raw =
    t(`serviceDetail.${serviceId}.ctaOrbit.diagram`) || {};
  const nodes = (raw.nodes || []).slice(0, 4);
  return {
    center: raw.center || "",
    centerSub: raw.centerSub || "",
    nodes,
    variant: CTA_VISUAL_VARIANTS[serviceId] || "odoo-hub",
  };
}

export function buildCTAContent(t, serviceId) {
  const raw = t(`serviceDetail.${serviceId}.ctaOrbit`) || {};
  return {
    eyebrow: raw.eyebrow || "",
    title: raw.title || "",
    highlight: raw.highlight || "",
    desc: raw.desc || "",
    button: raw.button || "",
  };
}
