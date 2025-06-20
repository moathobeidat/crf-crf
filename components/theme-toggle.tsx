"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<string>("lululemon");
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  // Get the initial theme from the DOM on mount
  useEffect(() => {
    setMounted(true);
    const theme = document.documentElement.getAttribute("data-theme") || "lululemon";
    setCurrentTheme(theme);

    // Listen for theme changes from other components
    const handleThemeChange = () => {
      const newTheme = document.documentElement.getAttribute("data-theme");
      if (newTheme) {
        setCurrentTheme(newTheme);
      }
    };

    // Create a MutationObserver to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          handleThemeChange();
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!mounted) return null;

  const changeTheme = (newTheme: string) => {
    // Add a class to indicate transition is happening
    document.documentElement.classList.add("theme-transitioning");

    // Set the theme directly on the document
    document.documentElement.setAttribute("data-theme", newTheme);

    // Store in localStorage for persistence
    localStorage.setItem("theme", newTheme);

    // Update our local state
    setCurrentTheme(newTheme);

    // Dispatch a custom event for other components with a small delay
    // to allow the initial CSS transitions to start
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("manual-theme-change", {
          detail: { theme: newTheme, previousTheme: currentTheme },
        })
      );

      // Remove the transitioning class after the transition completes
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 500);

      console.log(`Theme changed from ${currentTheme} to ${newTheme}`);
    }, 50);
  };

  // Use a dropdown menu on mobile
  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {currentTheme === "lego" && "Lego Theme"}
            {currentTheme === "that" && "THAT Theme"}
            {currentTheme === "lululemon" && "Lululemon Theme"}
            {currentTheme === "vox" && "VOX Theme"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={() => changeTheme("lego")} disabled={currentTheme === "lego"}>
            Apply Lego
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeTheme("that")} disabled={currentTheme === "that"}>
            Apply THAT
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeTheme("lululemon")}
            disabled={currentTheme === "lululemon"}
          >
            Apply Lululemon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeTheme("vox")} disabled={currentTheme === "vox"}>
            Apply VOX
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => changeTheme("carrefour")}
            disabled={currentTheme === "carrefour"}
          >
            Apply Carrefour
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Use buttons on desktop
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => changeTheme("lego")}
        variant={currentTheme === "lego" ? "default" : "outline"}
        className="rounded-full px-4 py-2 transition-all"
        disabled={currentTheme === "lego"}
      >
        Apply Lego
      </Button>
      <Button
        onClick={() => changeTheme("that")}
        variant={currentTheme === "that" ? "default" : "outline"}
        className="rounded-full px-4 py-2 transition-all"
        disabled={currentTheme === "that"}
      >
        Apply THAT
      </Button>
      <Button
        onClick={() => changeTheme("lululemon")}
        variant={currentTheme === "lululemon" ? "default" : "outline"}
        className="rounded-full px-4 py-2 transition-all"
        disabled={currentTheme === "lululemon"}
      >
        Apply Lululemon
      </Button>
      <Button
        onClick={() => changeTheme("vox")}
        variant={currentTheme === "vox" ? "default" : "outline"}
        className="rounded-full px-4 py-2 transition-all"
        disabled={currentTheme === "vox"}
      >
        Apply VOX
      </Button>
      <Button
        onClick={() => changeTheme("carrefour")}
        variant={currentTheme === "carrefour" ? "default" : "outline"}
        className="rounded-full px-4 py-2 transition-all"
        disabled={currentTheme === "carrefour"}
      >
        Apply Carrefour
      </Button>
    </div>
  );
}
