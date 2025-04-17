"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { decodeString } from "@/lib/decode-utils";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  currency?: string;
  imageUrl: string;
  badges?: Array<{
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }>;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  className?: string;
}

export function ProductCard({
  id,
  title,
  price,
  currency = "",
  imageUrl,
  badges = [],
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  className,
}: ProductCardProps) {
  const decodedTitle = decodeString(title);
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative">
        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite?.(id)}
          className="absolute top-2 left-2 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-blue-600 text-blue-600" : "text-blue-600"
            )}
          />
        </button>

        {/* Product image */}
        <div className="relative aspect-[4/4.8] w-full bg-white p-4">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="p-8 object-contain scale-100 hover:scale-110 ease-in duration-200"
            priority
          />
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-2">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || "default"}
                className={cn(
                  "text-tiny font-semibold px-2 rounded-none",
                  badge.variant === "default"
                    ? "bg-yellow-400 hover:bg-yellow-400 text-white"
                    : ""
                )}
              >
                {badge.text}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <CardContent className="p-0">
        <h3 className="text-sm font-medium mb-5 mt-4 truncate">
          {decodedTitle}
        </h3>
        <p className="text-base font-semibold">
          {currency} {price}
        </p>
      </CardContent>

      <CardFooter className="p-0 mt-3">
        <Button
          onClick={() => onAddToCart?.(id)}
          className="font-semibold w-full bg-orange-500 hover:bg-white border-1 text-black h-12 text-sm"
        >
          Add to Bag
        </Button>
      </CardFooter>
    </Card>
  );
}
