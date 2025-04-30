"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { decodeString } from "@/lib/decode-utils";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  currency?: string;
  imageUrl: string;
  brand?: string;
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
  originalPrice,
  currency = "",
  imageUrl,
  brand = "",
  badges = [],
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  className,
}: ProductCardProps) {
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

  const decodedTitle = decodeString(title);
  const showAddToCartButton = currentTheme === "lego" && mounted; // Only show Add to Bag for LEGO

  if (!mounted) {
    // Return a skeleton or simplified version during SSR
    return <Card className={cn("overflow-hidden product-card", className)}></Card>;
  }

  return (
    <Card className={cn("overflow-hidden product-card", className)}>
      <div className="relative product-image-container">
        {/* Favorite button - now shown for all themes */}
        <button
          onClick={() => onToggleFavorite?.(id)}
          className="favorite-button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("heart-icon", isFavorite ? "is-favorite" : "")}/>
        </button>

        {/* Product image */}
        <div className="product-image-wrapper">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="product-image"
            priority
          />
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="product-badges">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || "default"} className="product-badge">
                {badge.text}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <CardContent className="product-content">
        {/* Show brand name only for THAT theme */}
        {currentTheme === "that" && brand && (
          <p className="product-brand uppercase mt-4 text-muted-foreground">{brand}</p>
        )}
        <h3 className="product-title">{decodedTitle}</h3>

        {/* Price container with theme-specific alignment */}
        <div
          className={cn(
            "product-price-container",
            currentTheme === "that" ? "justify-center" : "justify-start"
          )}
        >
          <p className="product-price">
            {currency} {price}
          </p>
          {originalPrice && (
            <p className="product-original-price">
              {currency} {originalPrice}
            </p>
          )}
        </div>
      </CardContent>

      {/* Only show Add to Bag button for LEGO */}
      {showAddToCartButton && (
        <CardFooter className="product-footer">
          <Button onClick={() => onAddToCart?.(id)} className="add-to-cart-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="20"
              viewBox="0 0 16 20"
              aria-hidden="true"
              className="mr-2"
            >
              <g fill="currentColor" fillRule="evenodd">
                <path d="M4 3.512v5.804c0 .377.349.684.779.684.43 0 .779-.307.779-.684V3.512C5.558 2.33 6.653 1.368 8 1.368c1.347 0 2.442.962 2.442 2.144v5.804c0 .377.35.684.78.684.43 0 .778-.307.778-.684V3.512C12 1.575 10.206 0 8 0S4 1.575 4 3.512z"></path>
                <path d="M2.46 6.33c-.269 0-.489.194-.5.441L1.435 18.19a.436.436 0 00.131.332.52.52 0 00.348.149h12.151c.276 0 .501-.207.501-.462l-.525-11.436c-.011-.248-.23-.442-.5-.442H2.46zM14.448 20l-12.974-.001a1.591 1.591 0 01-1.064-.462 1.357 1.357 0 01-.408-1.03L.56 6.372C.595 5.602 1.277 5 2.11 5h11.78c.835 0 1.516.602 1.551 1.372l.56 12.197c0 .789-.697 1.431-1.553 1.431z"></path>
              </g>
            </svg>
            Add to Bag
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
