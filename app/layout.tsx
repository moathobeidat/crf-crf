import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeRouteSync } from "@/components/theme-route-sync"
import { ThemeCatalogueProvider } from "@/lib/context/theme-catalogue-context"
import { GlobalHeader } from "@/components/global-header"

// Use Google font for the base UI
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Multi-Brand Product Card",
  description: "A reusable product card component for multiple brands",
  generator: "Customer Solutions",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeCatalogueProvider>
          <ThemeRouteSync />
          <GlobalHeader />
          {children}
          <Toaster />
        </ThemeCatalogueProvider>
      </body>
    </html>
  )
}

import "./globals.css"
