import { type NextRequest, NextResponse } from "next/server";

// Define TypeScript interfaces for Figma API responses
interface FigmaRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaVariableValue {
  type: string;
  value: string | number | FigmaRGBA;
}

interface FigmaVariable {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: {
    [modeId: string]: any;
  };
}

interface FigmaVariableCollection {
  id: string;
  name: string;
  defaultModeId: string;
  modes: {
    modeId: string;
    name: string;
  }[];
}

interface FigmaVariablesResponse {
  variables: {
    [key: string]: FigmaVariable;
  };
  meta: {
    variableCollections: FigmaVariableCollection[];
  };
}

interface ThemeVariables {
  [themeName: string]: {
    [variableName: string]: string | number;
  };
}

// Configuration for Figma API - using personal access token
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

// Function to fetch variables from Figma file using access token
async function fetchFigmaVariables(fileKey: string): Promise<FigmaVariablesResponse> {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: {
      "X-Figma-Token": FIGMA_ACCESS_TOKEN || "",
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${await response.text()}`);
  }

  return await response.json();
}

// Helper function to convert Figma RGBA to CSS HSL value
function figmaColorToCssHsl(color: FigmaRGBA): string {
  // Figma uses RGBA with values between 0-1
  const { r, g, b } = color;

  // Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert to degrees, percentages
  const hDegrees = Math.round(h * 360);
  const sPercent = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `hsl(${hDegrees}, ${sPercent}%, ${lPercent}%)`;
}

// Map font weight names to numeric values
function mapFontWeightToNumeric(weight: string): number {
  const weightMap: { [key: string]: number } = {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    Regular: 400,
    Normal: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    XBold: 800,
    Black: 900,
    Heavy: 900,
  };

  return weightMap[weight] || 400; // Default to 400 if not found
}

// Add px suffix to numeric values that need it
function addPxSuffix(value: number | string, variableName: string, variableType: string): string {
  // For numeric values that should have px suffix
  if (typeof value === "number") {
    // Explicitly handle font size to ensure px suffix
    if (variableName.includes("font-size") || variableName.includes("font/size")) {
      return `${value}px`;
    }

    // Handle spacing and radius values
    if (variableName.includes("spacing") || variableName.includes("radius")) {
      return `${value}px`;
    }
  }

  return value.toString();
}

// Process Figma variables into CSS custom properties by theme
function processVariablesIntoCss(variablesData: any): string {
  // Extract collections and variables
  const collections = variablesData.meta.variableCollections;
  const variables = variablesData.meta.variables;

  // Identify primitive collection(s) - collections with only a single mode
  const primitiveCollectionIds = Object.values(collections)
    .filter((collection: any) => collection.modes.length === 1)
    .map((collection: any) => collection.id);

  console.log(`Identified primitive collections: ${primitiveCollectionIds.join(", ")}`);

  // First, process primitive variables (colors, etc.)
  const primitiveVars: { [name: string]: string } = {};
  const themeVars: { [mode: string]: { [name: string]: string } } = {};

  // Build a mapping of collection modes to theme names
  const modeToTheme: { [modeId: string]: string } = {};

  // Process collections and modes
  Object.values(collections).forEach((collection: any) => {
    collection.modes.forEach((mode: any) => {
      const themeName = mode.name.toLowerCase().replace(/\s+/g, "-");
      modeToTheme[mode.modeId] = themeName;

      // Initialize theme variables containers
      if (!themeVars[themeName]) {
        themeVars[themeName] = {};
      }
    });
  });

  // Variable reference map for resolving aliases
  const varIdToName: { [id: string]: string } = {};
  Object.entries(variables).forEach(([id, variable]: [string, any]) => {
    // Store the mapping from variable ID to CSS variable name
    const varName = variable.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
    varIdToName[variable.id] = varName;
  });

  // First pass: Process primitive variables (from collections with single mode)
  Object.entries(variables).forEach(([id, variable]: [string, any]) => {
    // Check if this variable belongs to a primitive collection
    if (primitiveCollectionIds.includes(variable.variableCollectionId)) {
      // Format the variable name - replace slashes with hyphens
      const varName = variable.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");

      // Get the value from the first mode
      const modeId = Object.keys(variable.valuesByMode)[0];
      let value = variable.valuesByMode[modeId];

      // handle variable aliases
      if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
        // This is a reference to another variable
        console.log(`Found variable alias for ${varName}:`, value);
        const referencedVarName = varIdToName[value.id];
        console.log(`Resolved variable alias ${value.id} to ${referencedVarName}`);
        if (referencedVarName) {
          primitiveVars[varName] = `var(--${referencedVarName})`;
        } else {
          primitiveVars[varName] = "initial"; // Fallback if reference not found
        }
      } else if (variable.resolvedType === "COLOR") {
        // Process based on variable type
        primitiveVars[varName] = figmaColorToCssHsl(value);
      } else if (variable.resolvedType === "FLOAT") {
        primitiveVars[varName] = addPxSuffix(value, varName, variable.resolvedType);
      } else if (variable.resolvedType === "STRING") {
        // Add quotes around font family names
        primitiveVars[varName] = value.includes(" ") ? `"${value}"` : value;
      } else {
        primitiveVars[varName] = value.toString();
      }
    }
  });

  // Second pass: Process semantic variables with references
  Object.entries(variables).forEach(([id, variable]: [string, any]) => {
    // Skip primitive collections
    if (!primitiveCollectionIds.includes(variable.variableCollectionId)) {
      const varName = variable.name.toLowerCase().replace(/\//g, "-");

      // Process each mode
      Object.entries(variable.valuesByMode).forEach(([modeId, value]: [string, any]) => {
        const themeName = modeToTheme[modeId];
        if (!themeName) return;

        let processedValue;

        // Handle variable aliases
        if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
          // This is a reference to another variable
          const referencedVarName = varIdToName[value.id];
          if (referencedVarName) {
            processedValue = `var(--${referencedVarName})`;
          } else {
            processedValue = "initial"; // Fallback if reference not found
          }
        } else if (variable.resolvedType === "COLOR" && value) {
          // Direct color value
          processedValue = figmaColorToCssHsl(value);
        } else if (variable.resolvedType === "FLOAT") {
          // Add px suffix to spacing, radius, and font size values
          processedValue = addPxSuffix(value, varName, variable.resolvedType);
        } else if (variable.resolvedType === "STRING" && varName.includes("font-weight")) {
          // Convert font weight names to numeric values
          processedValue = mapFontWeightToNumeric(value).toString();
        } else if (variable.resolvedType === "STRING" && varName.includes("font-family")) {
          // Map font family names to local fonts
          processedValue = mapFontFamilyToLocal(value);
        } else {
          // Other value types
          processedValue = value !== undefined ? value.toString() : "initial";
        }

        // Add to theme variables
        themeVars[themeName][varName] = processedValue;
      });
    }
  });

  // Generate CSS output
  let cssOutput = "";

  // Output primitive variables in :root
  cssOutput += ":root {\n";
  Object.entries(primitiveVars).forEach(([name, value]) => {
    cssOutput += `  --${name}: ${value};\n`;
  });
  cssOutput += "}\n\n";

  // Output theme variables with data-theme attributes
  Object.entries(themeVars).forEach(([theme, vars]) => {
    cssOutput += `[data-theme="${theme}"] {\n`;
    Object.entries(vars).forEach(([name, value]) => {
      cssOutput += `  --${name}: ${value};\n`;
    });
    cssOutput += "}\n\n";
  });

  return cssOutput;
}

// Map font family names to local fonts
function mapFontFamilyToLocal(fontFamily: string): string {
  // Map Figma font names to your local font variables
  const fontMap: { [key: string]: string } = {
    "Test Calibre": "'Calibre', Arial, sans-serif",
    "FONTSPRING DEMO - Cera Pro": "'Cera Pro', Arial, sans-serif",
    "Aktiv Grotesk": "'aktiv', Arial, sans-serif",
  };

  return fontMap[fontFamily] || `"${fontFamily}"`;
}

// Update the GET method to process font families
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("fileKey");

  // Validate required parameters
  if (!fileKey) {
    return NextResponse.json({ error: "No fileKey provided" }, { status: 400 });
  }

  // Validate that we have an access token configured
  if (!FIGMA_ACCESS_TOKEN) {
    return NextResponse.json({ error: "Figma access token not configured" }, { status: 500 });
  }

  try {
    // Fetch variables from Figma
    const figmaData = await fetchFigmaVariables(fileKey);

    // Process variables into CSS
    const cssOutput = processVariablesIntoCss(figmaData);

    // Return CSS with appropriate content type
    return new NextResponse(cssOutput, {
      headers: {
        "Content-Type": "text/css",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST endpoint to handle webhook notifications (if needed for auto-updates)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // If this is a webhook from Figma about file changes
    if (body.fileKey && body.event) {
      // You could trigger a regeneration of CSS here
      // For now, we'll just acknowledge the webhook
      return NextResponse.json({ status: "acknowledged" });
    }

    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
