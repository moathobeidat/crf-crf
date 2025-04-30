"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { fetchFigmaThemeCSS, applyThemeCSS } from "@/lib/utils/figma-theme";

// Map routes to themes
const routeThemeMap: Record<string, string> = {
  "/": "lego",
  "/lululemon": "lululemon",
};

export function ThemeRouteSync() {
  const pathname = usePathname();
  const initialLoadRef = useRef(true);
  const manualThemeChangeRef = useRef(false);

  // Listen for manual theme changes
  useEffect(() => {
    const handleManualThemeChange = () => {
      manualThemeChangeRef.current = true;
      console.log("Manual theme change detected in ThemeRouteSync");
    };

    window.addEventListener("manual-theme-change", handleManualThemeChange);

    return () => {
      window.removeEventListener("manual-theme-change", handleManualThemeChange);
    };
  }, []);

  // Set theme based on route when route changes
  useEffect(() => {
    // Skip if we've manually changed the theme
    if (manualThemeChangeRef.current) {
      console.log("Skipping route-based theme change due to manual theme change");
      return;
    }

    // Check for stored theme in localStorage
    const storedTheme = localStorage.getItem("theme");

    // Only set theme on initial load or when route changes
    if (initialLoadRef.current) {
      if (storedTheme) {
        console.log(`Using stored theme from localStorage: ${storedTheme}`);
        document.documentElement.setAttribute("data-theme", storedTheme);
      } else {
        const routeTheme = routeThemeMap[pathname] || "lego";
        console.log(`Setting initial theme based on route: ${routeTheme}`);
        document.documentElement.setAttribute("data-theme", routeTheme);
      }

      initialLoadRef.current = false;
    } else if (pathname === "/" && !storedTheme) {
      // Only force Lego theme on the home page if no stored theme
      console.log("Setting Lego theme for home page");
      document.documentElement.setAttribute("data-theme", "lego");
    }
  }, [pathname]);

  // Load Figma variables CSS on first render
  useEffect(() => {
    async function loadFigmaTheme() {
      try {
        const css = await fetchFigmaThemeCSS();
        if (css) {
          applyThemeCSS(css);
        } else {
          console.warn("No CSS loaded from Figma API");
        }
      } catch (err) {
        console.error("Failed to load Figma theme:", err);
      }
    }

    loadFigmaTheme();
  }, []);

  return null;
}
