"use client"

import Image from "next/image"
import { Heart, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { decodeString } from "@/lib/decode-utils"
import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"

export interface ProductCardProps {
  id: string
  title: string
  price: string
  originalPrice?: string
  currency?: string
  imageUrl: string
  brand?: string
  badges?: Array<{
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }>
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  onAddToCart?: (id: string) => void
  className?: string
  isTransitioning?: boolean
  // VOX-specific properties
  voxAgeRating?: string
  voxAdvanceBadge?: string
  voxRating?: string
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
  isTransitioning = false,
  voxAgeRating,
  voxAdvanceBadge,
  voxRating,
}: ProductCardProps) {
  const [currentTheme, setCurrentTheme] = useState<string>("lululemon")
  const [mounted, setMounted] = useState(false)
  const previousThemeRef = useRef<string>("lululemon")
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const theme = document.documentElement.getAttribute("data-theme") || "lululemon"
    setCurrentTheme(theme)
    previousThemeRef.current = theme

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          const newTheme = document.documentElement.getAttribute("data-theme")
          if (newTheme) {
            // If switching TO lego, prepare the card for transition
            if (newTheme === "lego" && previousThemeRef.current !== "lego") {
              // Pre-apply some lego styles to make transition smoother
              if (cardRef.current) {
                cardRef.current.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }
            }

            setCurrentTheme(newTheme)
            previousThemeRef.current = newTheme
          }
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  const decodedTitle = decodeString(title)
  const showAddToCartButton = currentTheme === "lego" && mounted // Only show Add to Bag for LEGO
  const hasDiscount = !!originalPrice

  // Apply title height if it's been set externally

  if (!mounted) {
    // Return a skeleton or simplified version during SSR
    return <Card className={cn("overflow-hidden product-card", className)}></Card>
  }

  // Special handling for VOX theme
  if (mounted && currentTheme === "vox") {
    // Generate a random age rating for each product
    const ageRatings = ["G", "PG", "PG-13", "PG-15", "R"]
    // Use the product ID to ensure consistent rating for the same product
    const ageRatingIndex = Number.parseInt(id.slice(-1), 10) % ageRatings.length

    // Use the provided age rating or generate a random one
    const ageRating = voxAgeRating || ageRatings[ageRatingIndex]

    // Use the provided rating or generate a random one
    // Ensure rating is a string to prevent NaN issues
    const rating = voxRating || (3 + (Number.parseInt(id.slice(-2), 10) % 20) / 10).toFixed(1)

    // Debug log to check the rating value
    console.log(`Movie ${id} rating:`, voxRating, typeof voxRating)

    // Use the provided advance badge text or default
    const advanceBadgeText = voxAdvanceBadge || "Advance Open"

    return (
      <Card
        ref={cardRef}
        className={cn("overflow-hidden product-card", className, isTransitioning && "theme-transition-active")}
      >
        <div className="relative product-image-container">
          {/* Age Rating Badge */}
          <div className="vox-age-badge">{ageRating}</div>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite?.(id)}
            className="favorite-button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Image
              src="/images/vox-heart.svg"
              alt="Favorite"
              width={38}
              height={36}
              className={cn("vox-heart-icon", isFavorite ? "is-favorite" : "")}
            />
          </button>

          {/* Product image */}
          <div className="product-image-wrapper">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="product-image" priority />
          </div>

          {/* Advance Open Badge */}
          <div className="vox-advance-badge">{advanceBadgeText}</div>
        </div>

        {/* Movie info */}
        <CardContent className="product-content">
          <h3 className="product-title" data-title-id={id}>
            {decodeString(title)}
          </h3>

          {/* Rating and Category Badges */}
          <div className="vox-badges-container">
            {badges && badges.length > 0 && <div className="vox-rating-badge">{badges[0].text}</div>}
            <div className="vox-rating-badge">
              {rating}
              <Image src="/images/vox-star.svg" alt="Star" width={12} height={11} className="vox-star-icon" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Special handling for Carrefour theme
  if (mounted && currentTheme === "carrefour") {
    // Format the price to split the integer and decimal parts
    const priceValue = Number.parseFloat(price) || 0
    const priceInteger = Math.floor(priceValue)
    const priceDecimal = (priceValue - priceInteger).toFixed(2).substring(2)

    // Extract weight from title or use the provided weight
    const weightMatch = title.match(/(\d+(?:\.\d+)?)\s*(kg|g|ml|l)/i)
    const weight = weightMatch ? weightMatch[0] : ""

    return (
      <Card
        ref={cardRef}
        className={cn("overflow-hidden product-card", className, isTransitioning && "theme-transition-active")}
      >
        <div className="relative product-image-container">
          {/* Bestseller badge - only show if it's in the badges */}
          {badges.some((badge) => badge.text.toLowerCase() === "bestseller") && (
            <div className="bestseller-badge">
              <Badge variant="secondary" className="product-badge">
                Bestseller
              </Badge>
            </div>
          )}

          {/* Product image */}
          <div className="product-image-wrapper">
            <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="product-image" priority />
          </div>

          {/* NOW delivery badge */}
          <span className="carrefour-now-badge">
            <svg
              height="18"
              stroke="hsl(210.2deg 84.53% 35.49%)"
              viewBox="0 0 66 24"
              width="52"
              fill="hsl(210.2deg 84.53% 35.49%)"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>NowIcon</title>
              <rect fill="white" height="22.5" rx="11.25" width="64.5" x="0.75" y="0.75"></rect>
              <path
                d="M42.0485 16.8999C42.0485 18.3669 43.2258 19.5529 44.6819 19.5529C46.138 19.5529 47.3153 18.3669 47.3153 16.8999M50.3672 11.0322L49.4378 8.87864V7.0684H52.1951V8.87864L54.3716 13.8724M44.9611 11.6488C45.2012 12.9206 46.3165 13.8804 47.6487 13.8804C49.1591 13.8804 50.3828 12.6476 50.3828 11.126M51.4128 7.06887L50.2665 4.44714H48.5857M54.7511 16.8998H40.608V13.8958C40.608 12.5537 41.6924 11.4613 43.0246 11.4613H43.6984M40.608 11.4613H46.1227M57.3918 16.8999C57.3918 15.433 56.2145 14.2469 54.7584 14.2469C53.3023 14.2469 52.125 15.433 52.125 16.8999C52.125 18.3668 53.3023 19.5528 54.7584 19.5528C56.2145 19.5528 57.3918 18.3668 57.3918 16.8999Z"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M10.556 10.7L10.58 13.568V16.292C10.58 16.76 10.232 17.144 9.76401 17.144C9.28401 17.144 8.98401 16.76 8.98401 16.292V8.62397C8.98401 8.20397 9.27201 7.77197 9.84801 7.77197C10.304 7.77197 10.58 7.98797 10.832 8.38397L14.516 14.132L14.504 11.12V8.62397C14.504 8.15597 14.816 7.77197 15.284 7.77197C15.764 7.77197 16.1 8.15597 16.1 8.62397V16.292C16.1 16.712 15.8 17.144 15.212 17.144C14.756 17.144 14.504 16.916 14.24 16.52L10.556 10.7Z"
                fill="hsl(210.2deg 84.53% 35.49%)"
                strokeWidth="0"
              ></path>
              <path
                d="M17.25 11.912C17.25 9.18797 18.75 7.77197 20.97 7.77197C23.19 7.77197 24.714 9.18797 24.714 11.912V13.112C24.714 15.836 23.19 17.18 20.97 17.18C18.75 17.18 17.25 15.836 17.25 13.112V11.912ZM18.966 13.196C18.966 14.792 19.53 15.74 20.97 15.74C22.422 15.74 22.998 14.792 22.998 13.196V11.828C22.998 10.196 22.386 9.21197 20.97 9.21197C19.626 9.21197 18.966 10.196 18.966 11.828V13.196Z"
                fill="hsl(210.2deg 84.53% 35.49%)"
                strokeWidth="0"
              ></path>
              <path
                d="M32.4134 16.196L31.5494 12.824L30.9134 10.4L29.2214 16.196C29.0534 16.784 28.8014 17.144 28.1174 17.144C27.5654 17.144 27.2534 16.856 27.0854 16.208L25.2494 9.04397C25.2134 8.83997 25.1894 8.69597 25.1894 8.58797C25.1894 8.09597 25.5854 7.77197 26.1014 7.77197C26.5214 7.77197 26.8694 8.03597 26.9414 8.40797L28.2494 14.768L30.0494 8.62397C30.1694 8.17997 30.3854 7.77197 30.9734 7.77197C31.6214 7.77197 31.8134 8.15597 31.9214 8.57597L33.5534 14.804L35.0534 8.35997C35.1494 8.01197 35.4374 7.77197 35.8454 7.77197C36.3374 7.77197 36.6734 8.10797 36.6734 8.55197C36.6734 8.68397 36.6374 8.81597 36.6014 8.93597L34.5614 16.184C34.3934 16.784 34.0574 17.144 33.5174 17.144C32.9294 17.144 32.5694 16.832 32.4134 16.196Z"
                fill="hsl(210.2deg 84.53% 35.49%)"
                strokeWidth="0"
              ></path>
            </svg>
          </span>

          {/* Add to cart button */}
          <button onClick={() => onAddToCart?.(id)} className="carrefour-add-button" aria-label="Add to cart">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Product info */}
        <CardContent className="product-content">
          <h3 className="product-title" data-title-id={id}>
            {decodeString(title)}
          </h3>

          {/* Weight information */}
          <p className="carrefour-weight">{weight}</p>

          {/* Price with superscript */}
          <div className="carrefour-price-container">
            <span className="carrefour-price-main">{priceInteger}</span>
            <span className="carrefour-price-superscript">
              .{priceDecimal} <br />
              <span className="carrefour-currency">AED</span>
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render the custom heart icon for THAT theme, or the default Heart component for other themes
  const renderHeartIcon = () => {
    if (currentTheme === "that") {
      return (
        <div className={cn("that-heart-icon", isFavorite ? "is-favorite" : "")}>
          <Image src="/images/that-heart-icon.svg" alt="Favorite" width={28} height={28} className="that-heart-svg" />
        </div>
      )
    } else if (currentTheme === "lululemon") {
      return (
        <div className={cn("lululemon-heart-icon", isFavorite ? "is-favorite" : "")}>
          <Image src="/images/wishlist.svg" alt="Favorite" width={24} height={24} className="lululemon-heart-svg" />
        </div>
      )
    } else {
      return <Heart className={cn("heart-icon", isFavorite ? "is-favorite" : "")} />
    }
  }

  return (
    <Card
      ref={cardRef}
      className={cn("overflow-hidden product-card", className, isTransitioning && "theme-transition-active")}
    >
      <div className="relative product-image-container">
        {/* Favorite button - now shown for all themes */}
        <button
          onClick={() => onToggleFavorite?.(id)}
          className="favorite-button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {renderHeartIcon()}
        </button>

        {/* Product image */}
        <div className="product-image-wrapper">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="product-image" priority />
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="product-badges">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || "default"}
                className="product-badge"
                data-badge-type={badge.text.toLowerCase() === "sale" ? "sale" : undefined}
              >
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
          <p className="product-brand uppercase mt-5 text-muted-foreground">{brand}</p>
        )}
        <h3 className="product-title" data-title-id={id}>
          {decodedTitle}
        </h3>

        {/* Price container with theme-specific alignment */}
        <div className={cn("product-price-container", currentTheme === "that" ? "justify-center" : "justify-start")}>
          <p className={cn("product-price", currentTheme === "that" && hasDiscount && "that-discounted-price")}>
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
  )
}
