"use client";

import { ProductCard, type ProductCardProps } from "@/components/product-card";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo, useRef } from "react";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousThemeRef = useRef<string>("lululemon");

  useEffect(() => {
    setMounted(true);
    const theme = document.documentElement.getAttribute("data-theme") || "lululemon";
    setCurrentTheme(theme);
    previousThemeRef.current = theme;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme") || "lululemon";

          // Start transition
          setIsTransitioning(true);

          // If we're transitioning TO lego theme, pre-calculate heights
          if (newTheme === "lego") {
            // Add a temporary class to make the transition smoother
            document.documentElement.classList.add("theme-transitioning");

            // Pre-calculate heights before theme fully applies
            setTimeout(() => {
              setCurrentTheme(newTheme);
            }, 10);

            // End transition after animation completes
            setTimeout(() => {
              setIsTransitioning(false);
              document.documentElement.classList.remove("theme-transitioning");
            }, 500);
          } else {
            // For other themes, just update normally
            setCurrentTheme(newTheme);

            // End transition after animation completes
            setTimeout(() => {
              setIsTransitioning(false);
            }, 500);
          }

          previousThemeRef.current = newTheme;
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
      : `product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
          currentTheme === "carrefour" ? "lg:grid-cols-6 gap-4" : "lg:grid-cols-4"
        }`;
  }, [currentTheme]);

  useEffect(() => {
    // Only run for LEGO theme after mounting and when products change
    if (mounted && currentTheme === "lego" && gridRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        // Get all rows in the grid
        const grid = gridRef.current;
        if (!grid) return;

        // Reset all title heights first
        const titles = grid.querySelectorAll(".product-title");
        titles.forEach((title) => {
          (title as HTMLElement).style.height = "auto";
        });

        // Group cards by rows
        const cards = Array.from(grid.children);
        if (cards.length === 0) return;

        // Get the first card's position to determine row grouping
        const firstCard = cards[0].getBoundingClientRect();
        let currentRow: HTMLElement[] = [];
        let currentTop = firstCard.top;

        // Group cards into rows based on their vertical position
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          // If this card is on a new row
          if (Math.abs(rect.top - currentTop) > 10) {
            // 10px tolerance
            // Process the completed row
            equalizeHeightsInRow(currentRow);
            // Start a new row
            currentRow = [card as HTMLElement];
            currentTop = rect.top;
          } else {
            // Add to current row
            currentRow.push(card as HTMLElement);
          }
        });

        // Process the last row
        if (currentRow.length > 0) {
          equalizeHeightsInRow(currentRow);
        }
      });
    }
  }, [products, mounted, currentTheme]);

  function equalizeHeightsInRow(rowCards: HTMLElement[]) {
    if (rowCards.length === 0) return;

    // Find the maximum title height in this row
    let maxTitleHeight = 0;
    rowCards.forEach((card) => {
      const title = card.querySelector(".product-title") as HTMLElement;
      if (title) {
        const titleHeight = title.scrollHeight;
        maxTitleHeight = Math.max(maxTitleHeight, titleHeight);
      }
    });

    // Apply the maximum height to all titles in this row
    if (maxTitleHeight > 0) {
      rowCards.forEach((card) => {
        const title = card.querySelector(".product-title") as HTMLElement;
        if (title) {
          title.style.height = `${maxTitleHeight}px`;
        }
      });
    }
  }

  return (
    <div
      ref={gridRef}
      className={cn(gridClasses, className, isTransitioning && "theme-transition-active")}
    >
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard {...product} onToggleFavorite={onToggleFavorite} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}
