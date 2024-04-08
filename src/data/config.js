export const instrumentColors = [
  "#0b73ae",
  "#87cadd",
  "#7fc07e",
  "#fbb158",
  "#c87db6",
  "#D2D2D2",
];

export const instrumentGroups = [
  {
    label: "Excise tax (targeted)",
    description:
      "Levied on the manufacture or import of specific goods or services, including at least one SSB category. Unsweetened bottled water exempt or taxed at a lower rate.",
    value: "exciseTargeted",
  },
  {
    label: "Excise tax (untargeted)",
    description:
      "Levied on the manufacture or import of specific goods or services, including at least one SSB category. Unsweetened bottled water taxed at the same or higher rate.",
    value: "exciseUntargeted",
  },
  {
    label: "Import tax",
    description:
      "Levied on goods imported for domestic consumption. Typically collected at port of entry. Targeted specifically to SSBs at a higher rate than that applied to unsweetened bottled water (HS heading 2201).",
    value: "Import",
  },
  {
    label: "Sales tax",
    description:
      "Levied on the final sale of goods and services as a percentage of retail price. Targeted specifically to SSBs and/or SSBs subject to higher rate than other foods and beverages, including unsweetened bottled water.",
    value: "Sales",
  },
  {
    label: "Value-Added Tax (VAT)/Goods and Services Tax (GST)",
    description:
      "Levied on a broad range of goods and services (as a percentage of value added at each stage of the supply chain). Differential rates apply, with SSB subject to higher rate than other foods and beverages, including unsweetened bottled water.",
    value: "VAT/GST",
  },
  {
    label: "No tax/data/selection",
    description:
      "No tax verified, no data, or jurisdiction not included in current selection.",
    value: "none",
  },
];

export const regionColors = [
  "#C48050",
  "#E55297",
  "#57B19A",
  "#7F3275",
  "#98BB66",
  "#31C4F3",
  "#FBBD55",
];

export const regionGroups = [
  {
    label: "East Asia & Pacific",
    value: "EAP",
    focus: [120, 20],
    scale: 1.4,
  },
  {
    label: "Europe & Central Asia",
    value: "ECA",
    focus: [0, 50],
    scale: 3,
  },
  {
    label: "Latin America & Caribbean",
    value: "LAC",
    focus: [-65, -20],
    scale: 1.5,
  },
  {
    label: "Middle East & North Africa",
    value: "MENA",
    focus: [40, 30],
    scale: 3,
  },
  {
    label: "North America",
    value: "NAR",
    focus: [-80, 50],
    scale: 3,
  },
  {
    label: "South Asia",
    value: "SAR",
    focus: [70, 20],
    scale: 3.5,
  },
  {
    label: "Africa",
    value: "AFR",
    focus: [15, -5],
    scale: 2.5,
  },
];

export const incomeColors = ["#1B4FA9", "#3674DE", "#B6D2FF", "#DAE8FF"];
export const incomeGroups = [
  { label: "High income", value: "HIC" },
  { label: "Upper middle income", value: "UMIC" },
  { label: "Lower middle income", value: "LMIC" },
  { label: "Low income", value: "LIC" },
];
