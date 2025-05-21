"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Header } from "@/components/header";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  ageRating: string;
  advanceBadge: string;
  rating: string;
  category: string;
}

export default function VoxPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Set VOX theme when this page loads
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "vox");
  }, []);

  // Load movies data
  useEffect(() => {
    async function fetchMovies() {
      try {
        // In a real app, we would fetch from an API
        // For this demo, we'll use a static JSON file
        const response = await fetch("/api/vox-movies");
        const data = await response.json();
        console.log("Loaded movies:", data.movies); // Debug log

        // Ensure ratings are strings
        const moviesWithStringRatings = data.movies.map((movie: any) => ({
          ...movie,
          rating: String(movie.rating), // Ensure rating is a string
        }));

        setMovies(moviesWithStringRatings);
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
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

  return (
    <div>
      <Header brand="vox" />
      <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">VOX Cinemas</h1>

          {isLoading ? (
            <div>Loading movies...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <ProductCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  price=""
                  imageUrl={movie.imageUrl}
                  badges={[{ text: movie.category }]}
                  isFavorite={favorites.has(movie.id)}
                  onToggleFavorite={toggleFavorite}
                  // Pass VOX-specific properties
                  voxAgeRating={movie.ageRating}
                  voxAdvanceBadge={movie.advanceBadge}
                  voxRating={movie.rating}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
