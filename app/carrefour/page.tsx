"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Header } from "@/components/header";

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  badges: Array<{
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }>;
}

export default function CarrefourPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState(0);

  // Set Carrefour theme when this page loads
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "carrefour");
  }, []);

  // Load products data
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/carrefour-products");
        const data = await response.json();
        console.log("Loaded products:", data.products);
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const addToCart = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      console.log(`Added ${product.title} to cart`);
      setCartCount((prev) => prev + 1);
      // Here you would typically update a cart state or call an API
    }
  };

  return (
    <div>
      <Header brand="carrefour" cartCount={cartCount} wishlistCount={favorites.size} />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Berries</h1>

          {isLoading ? (
            <div>Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  badges={product.badges}
                  isFavorite={favorites.has(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
