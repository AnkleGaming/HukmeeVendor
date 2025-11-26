// src/constants/colors.js
const Colors = {
  // Base backgrounds
  bgGray: "bg-gray-100",
  borderGray: "border-gray-200",
  divideGray: "divide-gray-200",

  // Text colors
  textWhite: "text-white",
  textGray: "text-gray-500",
  textGrayDark: "text-gray-900",
  textMuted: "text-gray-700",

  // 🔥 Unified Brand Gradient (Orange)
  primaryFrom: "from-[#FA7D09]", // Main orange
  primaryTo: "to-[#E56A00]", // Darker orange
  hoverFrom: "hover:from-[#E56A00]",
  hoverTo: "hover:to-[#C75A00]", // Even darker for hover
  primaryMain: "[#FA7D09]",

  // Alternate gradient → same as primary
  gradientFrom: "from-[#FA7D09]",
  gradientTo: "to-[#E56A00]",

  // Table header (can also be changed if you want orange theme instead of indigo)
  tableHeadBg: "bg-orange-50",
  tableHeadText: "text-[#FA7D09]",

  // Status colors (kept default for clarity)
  pendingBg: "bg-yellow-100",
  pendingText: "text-yellow-800",
  successBg: "bg-green-100",
  successText: "text-green-800",
};

export default Colors;
