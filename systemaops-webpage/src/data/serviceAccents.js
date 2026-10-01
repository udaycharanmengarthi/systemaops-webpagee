/* ================================================================
   SERVICE ACCENT MAP
   Logo-derived teal shades: one brand family, distinct per service.
   (Logo: #1A7F7F primary, #3BA3A1 secondary, #E8B831 gold dot.)

   - solid:    main accent hex (dark mode + hover states)
   - rgb:      raw channels for rgba(var(--c-rgb), a)
   - iconLight: deeper shade for icon color on light surfaces
=============================================================== */

export const serviceAccents = [
  {
    id: "aiAutomation",
    solid: "#1A7F7F",
    rgb: "26, 127, 127",
    iconLight: "#0F5252",
  },
  {
    id: "odoo",
    solid: "#3BA3A1",
    rgb: "59, 163, 161",
    iconLight: "#1A7F7F",
  },
  {
    id: "workflow",
    solid: "#2A9D9C",
    rgb: "42, 157, 156",
    iconLight: "#146666",
  },
  {
    id: "aiops",
    solid: "#4FBDBB",
    rgb: "79, 189, 187",
    iconLight: "#1A7F7F",
  },
  {
    id: "consulting",
    solid: "#20A7A0",
    rgb: "32, 167, 160",
    iconLight: "#0F5252",
  },
  {
    id: "integrations",
    solid: "#14807E",
    rgb: "20, 128, 126",
    iconLight: "#0F5252",
  },
];

export const getServiceAccent = (index) =>
  serviceAccents[index % serviceAccents.length] ||
  serviceAccents[0];
