"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"
import { toast } from "@/components/ui/use-toast"

export function ProductCardDemo() {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: "LEGO® Oracle Red Bull Racing RB20 F1 Car",
    })
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to bag",
      description: "LEGO® Oracle Red Bull Racing RB20 F1 Car",
    })
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <ProductCard
        id="demo-1"
        title="LEGO® Oracle Red Bull Racing RB20 F1 Car"
        price="1,099"
        currency="AED"
        imageUrl="/placeholder.svg?height=300&width=400"
        badges={[
          { text: "NEW", variant: "default" },
          { text: "EXCLUSIVE", variant: "default" },
        ]}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
