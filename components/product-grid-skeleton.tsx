"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export function ProductGridSkeleton() {
  const [currentTheme, setCurrentTheme] = useState<string>("lululemon");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = document.documentElement.getAttribute("data-theme") || "lululemon";
    setCurrentTheme(theme);
  }, []);

  // Create an array of 32 items (8 rows x 4 columns)
  const skeletonItems = Array.from({ length: 32 }, (_, i) => i);

  // Use different gap based on theme
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8";

  return (
    <div className={gridClass}>
      {skeletonItems.map((index) => {
        // Calculate if this is in the last row or first column
        const isLastRow = index >= 28; // Last 4 items (in a 4-column grid)
        const isFirstColumn = index % 4 === 0;

        return (
          <div key={index} className={`flex flex-col space-y-3`}>
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-4 w-3/4 mx-4" />
            <Skeleton className="h-4 w-1/2 mx-4 mb-4" />
          </div>
        );
      })}
    </div>
  );
}
