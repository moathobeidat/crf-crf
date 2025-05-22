"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useThemeCatalogue } from "@/lib/context/theme-catalogue-context"

export function ThemeRouteSync() {
  const { setTheme } = useThemeCatalogue()
  const pathname = usePathname()
  const initialLoadRef = useRef(true)
  const manualThemeChangeRef = useRef(false)

  // Listen for manual theme changes
  useEffect(() => {
    const handleManualThemeChange = () => {
      manualThemeChangeRef.current = true
      console.log("Manual theme change detected in ThemeRouteSync")
    }

    window.addEventListener("manual-theme-change", handleManualThemeChange)

    return () => {
      window.removeEventListener("manual-theme-change", handleManualThemeChange)
    }
  }, [])

  // Set theme based on route when route changes
  useEffect(() => {
    // Skip if we've manually changed the theme
    if (manualThemeChangeRef.current) {
      console.log("Skipping route-based theme change due to manual theme change")
      return
    }

    // Only update theme based on route if we're on a specific brand route
    if (pathname === "/lululemon") {
      setTheme("lululemon")
    } else if (pathname === "/vox") {
      setTheme("vox")
    } else if (pathname === "/carrefour") {
      setTheme("carrefour")
    } else if (pathname === "/that") {
      setTheme("that")
    }
    // Don't override theme on home page
  }, [pathname, setTheme])

  // Load Figma variables CSS on first render
  useEffect(() => {
    async function loadFigmaTheme() {
      try {
        // Assuming fetchFigmaThemeCSS and applyThemeCSS are defined elsewhere
        const css = await (async () => {
          return null
        })()
        const applyThemeCSS = (css: any) => {
          return null
        }
        if (css) {
          applyThemeCSS(css)
        } else {
          console.warn("No CSS loaded from Figma API")
        }
      } catch (err) {
        console.error("Failed to load Figma theme:", err)
      }
    }

    loadFigmaTheme()
  }, [])

  return null
}
