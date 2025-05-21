import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ThemeRouteSync } from "@/components/theme-route-sync";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

// Use Google font for the base UI
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Multi-Brand Product Card",
  description: "A reusable product card component for multiple brands",
  generator: "Customer Solutions",
};

// Update the links array to include Carrefour
const links: { href: string; label: string }[] = [
  { href: "/", label: "Lego" },
  { href: "/lululemon", label: "Lululemon" },
  { href: "/vox", label: "VOX" },
  { href: "/carrefour", label: "Carrefour" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeRouteSync />
        <header>
          <NavigationMenu className="m-4">
            <NavigationMenuList>
              {links.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link key={link.href} href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import "./globals.css";
