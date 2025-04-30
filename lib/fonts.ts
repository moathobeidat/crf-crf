import localFont from "next/font/local";

// Calibre Font Family
export const calibre = localFont({
  src: [
    {
      path: "../public/fonts/calibre/TestCalibre-Thin-BF661746edb928b.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-ThinItalic-BF661746edc3fda.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-Light-BF661746edb619a.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-LightItalic-BF661746edc3c43.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-Regular-BF661746edbee52.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-RegularItalic-BF661746edb584e.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-Medium-BF661746ed8cff9.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-MediumItalic-BF661746ed8877c.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-Semibold-BF661746ed9242e.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-SemiboldItalic-BF661746ed84cd9.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-Bold-BF661746ed7c530.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-BoldItalic-BF661746edbbfdf.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-Black-BF661746ec9d64f.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/calibre/TestCalibre-BlackItalic-BF661746ed485d7.otf",
      weight: "900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-calibre",
});

// Cera Pro Font Family
export const ceraPro = localFont({
  src: [
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-thinitalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-lightitalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-regularitalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-mediumitalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-bolditalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/cera-pro/Fontspring-DEMO-cerapro-blackitalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-cera-pro",
});

// Add console log to verify the font variables are being exported correctly
console.log("Font variables:", {
  calibreVariable: calibre.variable,
  ceraProVariable: ceraPro.variable,
});
