/* ================================================================
   SERVICE ACCENT MAP
   One deliberate identity per service. Used by the Services grid
   (and reusable for any service surface).

   - solid:    main accent hex (dark mode + hover states)
   - rgb:      raw channels for rgba(var(--c-rgb), a)
   - iconLight: deeper shade for icon color on light surfaces
=============================================================== */

export const serviceAccents = [
  {
    id: "aiAutomation",
    solid: "#22D3EE",
    rgb: "34, 211, 238",
    iconLight: "#0891B2",
  },
  {
    id: "odoo",
    solid: "#8B7CFF",
    rgb: "139, 124, 255",
    iconLight: "#6659D9",
  },
  {
    id: "workflow",
    solid: "#F5B942",
    rgb: "245, 185, 66",
    iconLight: "#B86A00",
  },
  {
    id: "aiops",
    solid: "#38BDF8",
    rgb: "56, 189, 248",
    iconLight: "#0369A1",
  },
  {
    id: "consulting",
    solid: "#FB7185",
    rgb: "251, 113, 133",
    iconLight: "#BE123C",
  },
  {
    id: "integrations",
    solid: "#34D399",
    rgb: "52, 211, 153",
    iconLight: "#047857",
  },
];

export const getServiceAccent = (index) =>
  serviceAccents[index % serviceAccents.length] ||
  serviceAccents[0];
