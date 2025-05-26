"use client"

import { useThemeCatalogue } from "@/lib/context/theme-catalogue-context"
import { Check, ChevronDown, Heart } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

type Brand = "lego" | "lululemon" | "that" | "vox" | "carrefour"
type Catalogue = "lego" | "lululemon" | "that" | "vox" | "carrefour"

interface DropdownOption {
  value: string
  label: string
}

export function GlobalHeader() {
  const { theme, catalogue, setTheme, setCatalogue } = useThemeCatalogue()
  const [themeOpen, setThemeOpen] = useState(false)
  const [catalogueOpen, setCatalogueOpen] = useState(false)

  const themeOptions: DropdownOption[] = [
    { value: "lego", label: "LEGO" },
    { value: "lululemon", label: "Lululemon" },
    { value: "that", label: "THAT" },
    { value: "vox", label: "VOX" },
    { value: "carrefour", label: "Carrefour" },
  ]

  const catalogueOptions: DropdownOption[] = [
    { value: "lego", label: "LEGO" },
    { value: "lululemon", label: "Lululemon" },
    { value: "that", label: "THAT" },
    { value: "vox", label: "VOX" },
    { value: "carrefour", label: "Carrefour" },
  ]

  const getSelectedOption = (options: DropdownOption[], value: string) => {
    return options.find((option) => option.value === value) || options[0]
  }

  const selectedTheme = getSelectedOption(themeOptions, theme)
  const selectedCatalogue = getSelectedOption(catalogueOptions, catalogue)

  return (
    <div className="bg-white py-3 border-b border-gray-100 sticky top-0 z-50 shadow-sm text-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and tagline */}
          {/* Dropdowns container */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Theme dropdown */}
            <div className="relative w-full sm:w-[180px]">
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-all",
                  "border border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200",
                  "bg-white text-gray-800 hover:text-gray-900",
                  themeOpen ? "bg-gray-50" : "bg-white",
                )}
              >
                <span>Theme: {selectedTheme.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200",
                    themeOpen ? "transform rotate-180" : "",
                  )}
                />
              </button>

              {themeOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10 text-gray-800">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value as Brand)
                        setThemeOpen(false)
                      }}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:text-gray-900 transition-colors",
                        theme === option.value ? "font-medium" : "font-normal",
                      )}
                    >
                      <span className="flex-1">{option.label}</span>
                      {theme === option.value && <Check className="h-4 w-4 text-gray-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Catalogue dropdown */}
            <div className="relative w-full sm:w-[180px]">
              <button
                onClick={() => setCatalogueOpen(!catalogueOpen)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-all",
                  "border border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200",
                  "bg-white text-gray-800 hover:text-gray-900",
                  catalogueOpen ? "bg-gray-50" : "bg-white",
                )}
              >
                <span>Catalogue: {selectedCatalogue.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200",
                    catalogueOpen ? "transform rotate-180" : "",
                  )}
                />
              </button>

              {catalogueOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10 text-gray-800">
                  {catalogueOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCatalogue(option.value as Catalogue)
                        setCatalogueOpen(false)
                      }}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:text-gray-900 transition-colors",
                        catalogue === option.value ? "font-medium" : "font-normal",
                      )}
                    >
                      <span className="flex-1">{option.label}</span>
                      {catalogue === option.value && <Check className="h-4 w-4 text-gray-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
