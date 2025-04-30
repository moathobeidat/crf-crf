"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { toast } from "@/components/ui/use-toast";
import { useSearch } from "@/lib/hooks/use-search";
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { results, isLoading, error, updateParams, setKeyword, changeSort, setPriceRange } =
    useSearch({
      keyword: "lego",
      currentPage: 0,
      pageSize: 32,
      sortBy: "relevance",
    });

  // Track favorite products
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Ensure Lego theme is applied when this page loads
  useEffect(() => {
    setTheme("lego");
    document.documentElement.setAttribute("data-theme", "lego");
  }, [setTheme]);

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
      let currency = "";

      if (product.price) {
        if (typeof product.price === "object") {
          price =
            product.price.formattedValue?.replace(/[^0-9,.]/g, "") ||
            product.price.value?.toString() ||
            "";
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
        currency: currency,
        imageUrl: imageUrl,
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

  // Display error if API request failed
  if (error) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-light mb-8">LEGO Collection</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error loading products</h2>
          <p>{error.message}</p>
          <button
            onClick={() => updateParams({ keyword: "lego" })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 px-0">
      <h1 className="text-3xl font-light mb-8 px-4">LEGO Collection</h1>
      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductGrid
          key={`product-grid-${theme}`} // Force re-render when theme changes
          products={products()}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
        />
      )}
    </main>
  );
}
