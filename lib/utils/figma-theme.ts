// lib/figma-theme.ts
// Utility functions for handling Figma theme variables

/**
 * Fetches CSS variables from the Figma API and returns them as a string
 */
export async function fetchFigmaThemeCSS(): Promise<string> {
  const fileKey = process.env.NEXT_PUBLIC_FIGMA_FILE_KEY;

  if (!fileKey) {
    console.error("NEXT_PUBLIC_FIGMA_FILE_KEY environment variable is not set");
    return "";
  }

  try {
    // Call our internal API to fetch the CSS
    const response = await fetch(`/api/figma-variables?fileKey=${fileKey}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch theme: ${response.status}`);
    }

    const cssText = await response.text();

    // Process the CSS to map font families to local font variables
    return processFontFamilies(cssText);
  } catch (error) {
    console.error("Error fetching Figma theme:", error);
    return "";
  }
}

/**
 * Process the CSS to replace Figma font families with local font variables
 */
function processFontFamilies(css: string): string {
  // Map Figma font names to your local font variables
  const fontMap: { [key: string]: string } = {
    "Test Calibre": "'Calibre', Arial, sans-serif",
    "FONTSPRING DEMO - Cera Pro": "'Cera Pro', Arial, sans-serif",
    "Aktiv Grotesk": "'aktiv', Arial, sans-serif",
  };

  // Replace font family values in the CSS
  let processedCss = css;

  Object.entries(fontMap).forEach(([figmaFont, localFont]) => {
    // Create a regex that matches the font-family CSS property with the Figma font
    // This regex needs to handle quotes properly
    const regex = new RegExp(`--font-family-[^:]+:\\s*["']?${figmaFont}["']?`, "g");

    // Replace with the local font variable
    processedCss = processedCss.replace(regex, (match) => {
      return match.replace(figmaFont, localFont);
    });
  });

  console.log("Processed font families in CSS");
  return processedCss;
}

/**
 * Applies CSS string to the document by creating or updating a style element
 */
export function applyThemeCSS(css: string): void {
  if (typeof document === "undefined") return; // Skip during SSR

  // Look for existing style element or create a new one
  let styleEl = document.getElementById("figma-theme-css");

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "figma-theme-css";
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
  console.log("Applied theme CSS to document");
}
