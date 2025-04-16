"use client";

import { useEffect, useState } from "react";
import { ProductCarousel } from "@/components/product-carousel";
import type { ProductCardProps } from "@/components/product-card";
import { toast } from "@/components/ui/use-toast";
import { useSearch } from "@/lib/hooks/use-search";

export default function Home() {
  const {
    results,
    isLoading,
    error,
    updateParams,
    setKeyword,
    changeSort,
    setPriceRange,
  } = useSearch({
    keyword: "lego",
    currentPage: 0,
    pageSize: 8,
    sortBy: "relevance",
  });

  // Track favorite products
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const products: Omit<ProductCardProps, "onToggleFavorite" | "onAddToCart">[] =
    results?.products.map((product) => ({
      id: product.id,
      title: product.name,
      price: product.price.formattedValue.replace(/[^0-9,.]/g, ""),
      currency: product.price.currency,
      imageUrl: product.links.defaultImages[0] || "/placeholder.png",
      badges: product.category.slice(0, 1).map((offer) => ({
        text: offer.name || "NEW",
        variant: "default",
      })),
      isFavorite: !!favorites[product.id],
    })) || [];

  // Toggle favorite handler
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev, [id]: !prev[id] };
      return newFavorites;
    });

    const product = products.find((p) => p.id === id);
    if (product) {
      toast({
        title: favorites[id] ? "Removed from favorites" : "Added to favorites",
        description: product.title,
      });
    }
  };

  // Add to cart handler
  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      toast({
        title: "Added to bag",
        description: product.title,
      });
    }
  };

  useEffect(() => {
    updateParams({ keyword: "lego", sortBy: "relevance" });
  }, [updateParams]);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-light mb-8">New in</h1>
      <ProductCarousel
        products={products}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
