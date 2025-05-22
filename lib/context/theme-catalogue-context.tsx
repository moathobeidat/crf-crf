"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Brand = "lego" | "lululemon" | "that" | "vox" | "carrefour"
type Catalogue = "lego" | "lululemon" | "that" | "vox" | "carrefour"

interface ThemeCatalogueContextType {
  theme: Brand
  catalogue: Catalogue
  setTheme: (theme: Brand) => void
  setCatalogue: (catalogue: Catalogue) => void
}

const ThemeCatalogueContext = createContext<ThemeCatalogueContextType | undefined>(undefined)

export function ThemeCatalogueProvider({ children }: { children: ReactNode }) {
  // Set default state to "lego" for both theme and catalogue
  const [theme, setThemeState] = useState<Brand>("lego")
  const [catalogue, setCatalogueState] = useState<Catalogue>("lego")

  const setTheme = (newTheme: Brand) => {
    setThemeState(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)

    // Dispatch event for theme change
    window.dispatchEvent(new CustomEvent("manual-theme-change"))
  }

  const setCatalogue = (newCatalogue: Catalogue) => {
    setCatalogueState(newCatalogue)
    localStorage.setItem("catalogue", newCatalogue)
  }

  // Initialize from localStorage on mount, with "lego" as fallback
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Brand | null
    const storedCatalogue = localStorage.getItem("catalogue") as Catalogue | null

    if (storedTheme) {
      setThemeState(storedTheme)
      document.documentElement.setAttribute("data-theme", storedTheme)
    } else {
      // If no theme in localStorage, set to "lego" and save to localStorage
      setThemeState("lego")
      document.documentElement.setAttribute("data-theme", "lego")
      localStorage.setItem("theme", "lego")
    }

    if (storedCatalogue) {
      setCatalogueState(storedCatalogue)
    } else {
      // If no catalogue in localStorage, set to "lego" and save to localStorage
      setCatalogueState("lego")
      localStorage.setItem("catalogue", "lego")
    }
  }, [])

  return (
    <ThemeCatalogueContext.Provider value={{ theme, catalogue, setTheme, setCatalogue }}>
      {children}
    </ThemeCatalogueContext.Provider>
  )
}

export function useThemeCatalogue() {
  const context = useContext(ThemeCatalogueContext)
  if (context === undefined) {
    throw new Error("useThemeCatalogue must be used within a ThemeCatalogueProvider")
  }
  return context
}
