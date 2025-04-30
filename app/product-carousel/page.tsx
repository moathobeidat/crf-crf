"use client";

import { useState } from "react";
import { ProductCarousel } from "@/components/product-carousel";
import type { ProductCardProps } from "@/components/product-card";
import { toast } from "@/components/ui/use-toast";

export default function ProductCarouselPage() {
  // Sample products data
  const [products, setProducts] = useState<
    Omit<ProductCardProps, "onToggleFavorite" | "onAddToCart">[]
  >([
    {
      id: "1",
      title: "LEGO® Oracle Red Bull Racing RB20 F1 Car",
      price: "1,099",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [
        { text: "NEW", variant: "default" },
        { text: "EXCLUSIVE", variant: "default" },
      ],
      isFavorite: false,
    },
    {
      id: "2",
      title: "LEGO® Technic Ferrari 296 GTS",
      price: "899",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [{ text: "BESTSELLER", variant: "default" }],
      isFavorite: true,
    },
    {
      id: "3",
      title: "LEGO® Icons Orchid",
      price: "499",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [],
      isFavorite: false,
    },
    {
      id: "4",
      title: "LEGO® Star Wars™ R2-D2™",
      price: "799",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [{ text: "LIMITED", variant: "default" }],
      isFavorite: false,
    },
    {
      id: "5",
      title: "LEGO® Architecture Eiffel Tower",
      price: "1,299",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [{ text: "PREMIUM", variant: "default" }],
      isFavorite: false,
    },
    {
      id: "6",
      title: "LEGO® Creator Expert Titanic",
      price: "1,599",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [
        { text: "COLLECTOR", variant: "default" },
        { text: "EXCLUSIVE", variant: "default" },
      ],
      isFavorite: false,
    },
    {
      id: "7",
      title: "LEGO® Harry Potter™ Hogwarts Castle",
      price: "1,199",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [{ text: "POPULAR", variant: "default" }],
      isFavorite: false,
    },
    {
      id: "8",
      title: "LEGO® Ideas NASA Space Shuttle",
      price: "899",
      currency: "AED",
      imageUrl: "/placeholder.svg?height=300&width=400",
      badges: [{ text: "LAST ITEMS", variant: "default" }],
      isFavorite: false,
    },
  ]);

  // Toggle favorite handler
  const handleToggleFavorite = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, isFavorite: !product.isFavorite } : product
      )
    );

    const product = products.find((p) => p.id === id);
    if (product) {
      toast({
        title: product.isFavorite ? "Removed from favorites" : "Added to favorites",
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Product Carousel</h1>
      <ProductCarousel
        products={products}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        className="mx-auto"
      />
    </div>
  );
}
