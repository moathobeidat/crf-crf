"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel as CarouselPrimitive,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard, type ProductCardProps } from "@/components/product-card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCarouselProps {
  products: Omit<ProductCardProps, "onToggleFavorite" | "onAddToCart">[];
  onToggleFavorite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  className?: string;
}

export function ProductCarousel({
  products,
  onToggleFavorite,
  onAddToCart,
  className,
}: ProductCarouselProps) {
  // Check if we're on desktop (large screen)
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [api, setApi] = useState<any>(null);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  // Set carousel options based on screen size
  const [slidesToScroll, setSlidesToScroll] = useState(1);

  useEffect(() => {
    setSlidesToScroll(isDesktop ? 4 : 1);
  }, [isDesktop]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setPrevBtnEnabled(api.canScrollPrev());
    setNextBtnEnabled(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    // Initial check
    onSelect();

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  const scrollPrev = useCallback(() => {
    if (api) api.scrollPrev(slidesToScroll);
  }, [api, slidesToScroll]);

  const scrollNext = useCallback(() => {
    if (api) api.scrollNext(slidesToScroll);
  }, [api, slidesToScroll]);

  return (
    <div className="relative w-full">
      <CarouselPrimitive
        setApi={setApi}
        className={cn("w-full", className)}
        opts={{
          align: "start",
          slidesToScroll: slidesToScroll,
        }}
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-8 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div>
                <ProductCard
                  {...product}
                  onToggleFavorite={onToggleFavorite}
                  onAddToCart={onAddToCart}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        {prevBtnEnabled && (
          <Button
            variant="outline"
            size="icon"
            className="absolute xl:-left-10 left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white text-black"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </Button>
        )}

        {nextBtnEnabled && (
          <Button
            variant="outline"
            size="icon"
            className="absolute xl:-right-10 right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white text-black"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </Button>
        )}
      </CarouselPrimitive>
    </div>
  );
}
