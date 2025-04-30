"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<string>("lululemon");
  const [mounted, setMounted] = useState(false);

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
    // Set the theme directly on the document
    document.documentElement.setAttribute("data-theme", newTheme);

    // Store in localStorage for persistence
    localStorage.setItem("theme", newTheme);

    // Update our local state
    setCurrentTheme(newTheme);

    // Dispatch a custom event for other components
    window.dispatchEvent(
      new CustomEvent("manual-theme-change", {
        detail: { theme: newTheme, previousTheme: currentTheme },
      })
    );

    console.log(`Theme changed from ${currentTheme} to ${newTheme}`);
  };

  return (
    <div className="flex flex-nowrap gap-2">
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
    </div>
  );
}
