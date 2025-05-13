"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { toast } from "@/components/ui/use-toast";
import { useSearch } from "@/lib/hooks/use-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeDebug } from "@/components/theme-debug";

export default function Lululemon() {
  const { results, isLoading, error, updateParams, setKeyword } = useSearch({
    keyword: "lululemon",
    currentPage: 0,
    pageSize: 32,
    sortBy: "relevance",
  });

  // Track favorite products
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Track current theme for UI updates
  const [currentTheme, setCurrentTheme] = useState<string>("lululemon");
  const forceUpdateRef = useRef(0);

  // Set initial theme on page load
  useEffect(() => {
    // Check if there's a manually set theme in localStorage
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme && ["lululemon", "that", "lego"].includes(storedTheme)) {
      console.log(`Using stored theme from localStorage: ${storedTheme}`);
      document.documentElement.setAttribute("data-theme", storedTheme);
      setCurrentTheme(storedTheme);
    } else {
      // Default to lululemon theme
      console.log("Setting default lululemon theme");
      document.documentElement.setAttribute("data-theme", "lululemon");
      setCurrentTheme("lululemon");
    }
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const handleManualThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newTheme = customEvent.detail?.theme;

      if (newTheme) {
        console.log(`Manual theme change detected in page: ${newTheme}`);
        setCurrentTheme(newTheme);
        forceUpdateRef.current += 1;
      }
    };

    window.addEventListener("manual-theme-change", handleManualThemeChange);

    // Also watch for direct DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme");
          if (newTheme && newTheme !== currentTheme) {
            console.log(`DOM theme attribute changed to: ${newTheme}`);
            setCurrentTheme(newTheme);
            forceUpdateRef.current += 1;
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener("manual-theme-change", handleManualThemeChange);
      observer.disconnect();
    };
  }, [currentTheme]);

  // Memoize products to prevent unnecessary re-renders
  const products = useCallback(() => {
    // Add a null check to ensure results and results.products exist
    if (!results || !results.products) {
      console.log("No results or products found in API response");
      return [];
    }

    // Log the first product to see its structure
    if (results.products.length > 0) {
      console.log("First product structure:", results.products[0]);
    }

    return results.products.map((product) => {
      // Handle different API response structures
      const name = product.name || product.title || "Unknown Product";

      // Handle different price structures
      let price = "";
      let originalPrice = undefined;
      let currency = "";

      if (product.price) {
        if (typeof product.price === "object") {
          // Check if product has a discount
          const hasDiscount = !!product.price.discount;

          price = hasDiscount
            ? product.price.discount?.formattedValue?.replace(/[^0-9,.]/g, "") ||
              product.price.discount?.value?.toString() ||
              ""
            : product.price.formattedValue?.replace(/[^0-9,.]/g, "") ||
              product.price.value?.toString() ||
              "";

          originalPrice = hasDiscount
            ? product.price.formattedValue?.replace(/[^0-9,.]/g, "") || undefined
            : undefined;

          currency = product.price.currency || product.price.currencyCode || "AED";
        } else {
          price = product.price.toString();
        }
      }

      // Handle different image structures
      let imageUrl = "/assorted-products-display.png";
      if (product.links?.defaultImages && product.links.defaultImages.length > 0) {
        imageUrl = product.links.defaultImages[0];
      } else if (product.images && product.images.length > 0) {
        imageUrl = product.images[0];
      } else if (product.imageUrl) {
        imageUrl = product.imageUrl;
      }

      // Handle different badge structures
      let badges = [];
      if (product.promoBadges && Array.isArray(product.promoBadges)) {
        badges = product.promoBadges.map((badge) => ({
          text: badge.text?.boldText || badge.text || badge.name || "NEW",
          variant: "default",
        }));
      } else if (product.badges && Array.isArray(product.badges)) {
        badges = product.badges.map((badge) => ({
          text: badge.text || badge.name || "NEW",
          variant: "default",
        }));
      }

      return {
        id: product.id || product._id || "",
        title: name,
        price: price,
        originalPrice: originalPrice,
        currency: currency,
        imageUrl: imageUrl,
        brand: product.brand?.name || "",
        badges: badges,
        isFavorite: !!favorites[product.id || product._id || ""],
      };
    });
  }, [results, favorites]);

  // Toggle favorite handler
  const handleToggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const newFavorites = { ...prev, [id]: !prev[id] };
        return newFavorites;
      });

      const product = products().find((p) => p.id === id);
      if (product) {
        toast({
          title: favorites[id] ? "Removed from favorites" : "Added to favorites",
          description: product.title,
        });
      }
    },
    [products, favorites]
  );

  // Add to cart handler
  const handleAddToCart = useCallback(
    (id: string) => {
      const product = products().find((p) => p.id === id);
      if (product) {
        toast({
          title: "Added to bag",
          description: product.title,
        });
      }
    },
    [products]
  );

  useEffect(() => {
    updateParams({ keyword: "lululemon", sortBy: "relevance", pageSize: 32 });
  }, [updateParams]);

  // Get theme name for display
  const getThemeDisplayName = () => {
    switch (currentTheme) {
      case "lego":
        return "Lego";
      case "that":
        return "THAT";
      case "lululemon":
        return "Lululemon";
      case "vox":
        return "VOX";
      default:
        return "Lululemon";
    }
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-light">{getThemeDisplayName()} Collection</h1>
        <ThemeToggle />
      </div>
      {isLoading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error loading products</h2>
          <p>{error.message}</p>
          <button
            onClick={() =>
              updateParams({ keyword: "lululemon", sortBy: "relevance", pageSize: 32 })
            }
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <ProductGrid
          key={`product-grid-${currentTheme}-${forceUpdateRef.current}`}
          products={products()}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
        />
      )}
      <ThemeDebug />
    </main>
  );
}
