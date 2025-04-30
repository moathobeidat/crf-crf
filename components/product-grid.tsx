"use client";

import { ProductCard, type ProductCardProps } from "@/components/product-card";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

interface ProductGridProps {
  products: Omit<ProductCardProps, "onToggleFavorite" | "onAddToCart">[];
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  className?: string;
}

export function ProductGrid({
  products,
  onToggleFavorite,
  onAddToCart,
  className,
}: ProductGridProps) {
  const [currentTheme, setCurrentTheme] = useState<string>("lululemon");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = document.documentElement.getAttribute("data-theme") || "lululemon";
    setCurrentTheme(theme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme");
          if (newTheme) {
            setCurrentTheme(newTheme);
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Memoize grid classes to prevent unnecessary re-renders
  const gridClasses = useMemo(() => {
    return currentTheme === "lego"
      ? "product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0"
      : "product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }, [currentTheme]);

  return (
    <div className={cn(gridClasses, className)}>
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard {...product} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}
