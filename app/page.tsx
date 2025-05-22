"use client"

import { useEffect, useState, useCallback } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { toast } from "@/components/ui/use-toast"
import { useSearch } from "@/lib/hooks/use-search"
import { Header } from "@/components/header"
import { useThemeCatalogue } from "@/lib/context/theme-catalogue-context"

export default function Home() {
  const { theme, catalogue } = useThemeCatalogue()

  // For API-based catalogues (lego, lululemon, that)
  const { results, isLoading, error, updateParams } = useSearch({
    keyword: catalogue === "that" ? "lululemon" : catalogue,
    currentPage: 0,
    pageSize: 32,
    sortBy: "relevance",
  })

  // For JSON-based catalogues (vox, carrefour)
  const [voxMovies, setVoxMovies] = useState([])
  const [carrefourProducts, setCarrefourProducts] = useState([])
  const [isLoadingCustomData, setIsLoadingCustomData] = useState(false)

  // Track favorites and cart
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Fetch VOX and Carrefour data when needed
  useEffect(() => {
    async function fetchCustomData() {
      if (catalogue === "vox") {
        setIsLoadingCustomData(true)
        try {
          const response = await fetch("/api/vox-movies")
          const data = await response.json()
          setVoxMovies(data.movies || [])
        } catch (error) {
          console.error("Failed to load VOX movies:", error)
        } finally {
          setIsLoadingCustomData(false)
        }
      } else if (catalogue === "carrefour") {
        setIsLoadingCustomData(true)
        try {
          const response = await fetch("/api/carrefour-products")
          const data = await response.json()
          setCarrefourProducts(data.products || [])
        } catch (error) {
          console.error("Failed to load Carrefour products:", error)
        } finally {
          setIsLoadingCustomData(false)
        }
      }
    }

    fetchCustomData()
  }, [catalogue])

  // Update search params when catalogue changes for API-based catalogues
  useEffect(() => {
    if (catalogue === "lego" || catalogue === "lululemon" || catalogue === "that") {
      updateParams({
        keyword: catalogue === "that" ? "lululemon" : catalogue,
        currentPage: 0,
        pageSize: 32,
        sortBy: "relevance",
      })
    }
  }, [catalogue, updateParams])

  // Toggle favorite handler
  const handleToggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const newFavorites = { ...prev, [id]: !prev[id] }
        setWishlistCount(Object.values(newFavorites).filter(Boolean).length)
        return newFavorites
      })

      const product = getProducts().find((p) => p.id === id)
      if (product) {
        toast({
          title: favorites[id] ? "Removed from favorites" : "Added to favorites",
          description: product.title,
        })
      }
    },
    [favorites],
  )

  // Add to cart handler
  const handleAddToCart = useCallback((id: string) => {
    setCartCount((prev) => prev + 1)

    const product = getProducts().find((p) => p.id === id)
    if (product) {
      toast({
        title: "Added to bag",
        description: product.title,
      })
    }
  }, [])

  // Get products based on the selected catalogue
  const getProducts = useCallback(() => {
    if (catalogue === "vox") {
      return voxMovies.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        price: "",
        currency: "",
        imageUrl: movie.imageUrl,
        badges: [{ text: movie.ageRating, variant: "default" }],
        isFavorite: !!favorites[movie.id],
      }))
    } else if (catalogue === "carrefour") {
      return carrefourProducts.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        currency: "AED",
        imageUrl: product.imageUrl,
        badges: product.badges || [],
        isFavorite: !!favorites[product.id],
      }))
    } else {
      // For lego, lululemon, and that catalogues
      if (!results || !results.products) {
        return []
      }

      return results.products.map((product) => {
        // Handle different API response structures
        const name = product.name || product.title || "Unknown Product"

        // Handle different price structures
        let price = ""
        let currency = ""

        if (product.price) {
          if (typeof product.price === "object") {
            price = product.price.formattedValue?.replace(/[^0-9,.]/g, "") || product.price.value?.toString() || ""
            currency = product.price.currency || product.price.currencyCode || "AED"
          } else {
            price = product.price.toString()
          }
        }

        // Handle different image structures
        let imageUrl = "/assorted-products-display.png"
        if (product.links?.defaultImages && product.links.defaultImages.length > 0) {
          imageUrl = product.links.defaultImages[0]
        } else if (product.images && product.images.length > 0) {
          imageUrl = product.images[0]
        } else if (product.imageUrl) {
          imageUrl = product.imageUrl
        }

        // Handle different badge structures
        let badges = []
        if (product.promoBadges && Array.isArray(product.promoBadges)) {
          badges = product.promoBadges.map((badge) => ({
            text: badge.text?.boldText || badge.text || badge.name || "NEW",
            variant: "default",
          }))
        } else if (product.badges && Array.isArray(product.badges)) {
          badges = product.badges.map((badge) => ({
            text: badge.text || badge.name || "NEW",
            variant: "default",
          }))
        }

        return {
          id: product.id || product._id || "",
          title: name,
          price: price,
          currency: currency,
          imageUrl: imageUrl,
          badges: badges,
          isFavorite: !!favorites[product.id || product._id || ""],
        }
      })
    }
  }, [results, favorites, voxMovies, carrefourProducts, catalogue])

  // Get the title based on the selected catalogue
  const getCatalogueTitle = () => {
    switch (catalogue) {
      case "lego":
        return "LEGO Collection"
      case "lululemon":
        return "Lululemon Collection"
      case "that":
        return "THAT Collection"
      case "vox":
        return "VOX Cinemas"
      case "carrefour":
        return "Carrefour Berries"
      default:
        return "Product Collection"
    }
  }

  // Determine if we should show loading state
  const showLoading =
    catalogue === "lego" || catalogue === "lululemon" || catalogue === "that" ? isLoading : isLoadingCustomData

  // Display error if API request failed
  if (error && (catalogue === "lego" || catalogue === "lululemon" || catalogue === "that")) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-light mb-8">{getCatalogueTitle()}</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error loading products</h2>
          <p>{error.message}</p>
          <button
            onClick={() => updateParams({ keyword: catalogue })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <>
      <Header brand={theme} cartCount={cartCount} wishlistCount={wishlistCount} />
      <main className="w-full">
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-[4.0625rem] md:ml-8 lg:ml-[6rem] md:mr-8 lg:mr-[6rem] py-10">
          <h1 className="text-3xl font-light mb-8">{getCatalogueTitle()}</h1>
          {showLoading ? (
            <ProductGridSkeleton />
          ) : (
            <ProductGrid
              key={`product-grid-${theme}-${catalogue}`}
              products={getProducts()}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </main>
    </>
  )
}
