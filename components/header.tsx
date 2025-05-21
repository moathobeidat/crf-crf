"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, ShoppingBag, Heart, MapPin, ChevronDown, Truck, Clock, Package, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Define the props for the header component
interface HeaderProps {
  brand: "carrefour" | "vox" | "lego" | "lululemon" | "that"
  cartCount?: number
  wishlistCount?: number
  isLoggedIn?: boolean
  username?: string
}

export function Header({ brand, cartCount = 0, wishlistCount = 0, isLoggedIn = false, username }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll event to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Brand-specific configurations
  const brandConfig = {
    carrefour: {
      logo: "/images/logos/carrefour-logo.svg",
      logoAlt: "Carrefour",
      logoWidth: 180,
      logoHeight: 40,
      primaryColor: "bg-[#0e5aa7]",
      secondaryColor: "bg-[#0e5aa7]", // Same blue for nav
      textColor: "text-white",
      searchPlaceholder: "Search for products",
      searchVariant: "rounded",
      navItems: [
        { label: "All Categories", href: "/categories" },
        { label: "Fresh Food", href: "/fresh-food" },
        { label: "Fruits & Vegetables", href: "/fruits-vegetables" },
        { label: "Food Cupboard", href: "/food-cupboard" },
        { label: "Beverages", href: "/beverages" },
        { label: "Baby Products", href: "/baby-products" },
        { label: "Smartphones, Tablets & Wearables", href: "/electronics" },
        { label: "Electronics & Appliances", href: "/appliances" },
      ],
      deliveryOptions: [
        { id: "scheduled", label: "Scheduled", icon: "clock" },
        { id: "now", label: "NOW", icon: "truck" },
        { id: "electronics", label: "Electronics+", icon: "package" },
      ],
      languages: [{ code: "en", name: "English", flag: "🇦🇪" }],
      location: "DubaiFestivalCity-Dubai",
      deliveryTime: "Everyday essentials in 60 mins. Minimum order AED 95",
      promoMessages: [],
    },
    vox: {
      logo: "/images/logos/vox-logo.svg",
      logoAlt: "VOX Cinemas",
      logoWidth: 96,
      logoHeight: 32,
      primaryColor: "bg-[#000814]", // Updated to match the exact dark blue/black color
      textColor: "text-white",
      searchPlaceholder: "Search for movies, events, sports...",
      searchVariant: "pill",
      navItems: [
        { label: "MOVIES", href: "/movies", hasDropdown: true },
        { label: "EVENTS & SPORTS", href: "/events", hasDropdown: true },
        { label: "OFFERS", href: "/offers", hasDropdown: true },
        { label: "EXPERIENCES", href: "/experiences", hasDropdown: true },
        { label: "B2B & CORPORATE", href: "/corporate" },
      ],
      deliveryOptions: [],
      languages: [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "ar", name: "العربية", flag: "🇦🇪" },
      ],
      location: "",
      deliveryTime: "",
      promoMessages: [],
      cinemaSelector: "SELECT YOUR CINEMA",
    },
    lego: {
      logo: "/images/logos/lego-logo.webp",
      logoAlt: "LEGO",
      logoWidth: 60,
      logoHeight: 60,
      primaryColor: "bg-[#ffcf00]",
      textColor: "text-gray-900",
      searchPlaceholder: "Search",
      searchVariant: "default",
      navItems: [
        { label: "SHOP", href: "/shop" },
        { label: "DISCOVER", href: "/discover" },
        { label: "HELP", href: "/help" },
      ],
      deliveryOptions: [],
      languages: [],
      location: "UAE",
      deliveryTime: "",
      promoMessages: ["Free gift set when you purchase The Lord of the Rings: The Shire™ set*"],
      playZone: "PLAY ZONE",
    },
    lululemon: {
      logo: "/images/logos/lululemon-logo.svg",
      logoAlt: "lululemon",
      logoWidth: 120,
      logoHeight: 40,
      primaryColor: "bg-white",
      textColor: "text-gray-900",
      searchPlaceholder: "Search",
      searchVariant: "default",
      navItems: [
        { label: "WOMENS", href: "/womens" },
        { label: "MENS", href: "/mens" },
        { label: "ACCESSORIES", href: "/accessories" },
        { label: "SHOES", href: "/shoes" },
      ],
      deliveryOptions: [],
      languages: [],
      location: "United Arab Emirates (AED)",
      deliveryTime: "",
      promoMessages: ["10% off your first order use code HELLO10"],
      trackOrder: "Track Order",
    },
    that: {
      logo: "/images/logos/that-logo.svg",
      logoAlt: "THAT",
      logoWidth: 116,
      logoHeight: 36,
      primaryColor: "bg-white",
      textColor: "text-gray-900",
      searchPlaceholder: "Search",
      searchVariant: "default",
      navItems: [
        { label: "Sale", href: "/sale", className: "text-red-500" },
        { label: "New In", href: "/new-in" },
        { label: "Designers", href: "/designers" },
        { label: "THAT Resort", href: "/that-resort" },
        { label: "Clothing", href: "/clothing" },
        { label: "Shoes", href: "/shoes" },
        { label: "Jewellery & Watches", href: "/jewellery-watches" },
        { label: "Grooming", href: "/grooming" },
        { label: "Bags", href: "/bags" },
        { label: "Accessories", href: "/accessories" },
        { label: "Shop By", href: "/shop-by" },
        { label: "Kids", href: "/kids" },
      ],
      languages: [{ code: "en", name: "English", flag: "🇦🇪" }],
      location: "",
      deliveryTime: "",
      promoMessages: [
        "SAME DAY DELIVERY IN DUBAI*",
        "SHOP NOW PAY LATER*",
        "CLICK & COLLECT*",
        "15% OFF YOUR FIRST ORDER - USE CODE: HELLO15",
      ],
      categories: [
        { label: "WOMEN", href: "/women" },
        { label: "MEN", href: "/men", isActive: true },
        { label: "HOME & GIFTS", href: "/home-gifts" },
      ],
    },
  }

  const config = brandConfig[brand]

  // Render the header based on the brand
  const renderHeader = () => {
    switch (brand) {
      case "carrefour":
        return (
          <>
            {/* Delivery options */}
            <div className="bg-white">
              <div className="container mx-auto">
                <div className="flex overflow-x-auto">
                  {config.deliveryOptions.map((option, index) => (
                    <Link
                      key={option.id}
                      href={`#${option.id}`}
                      className={`py-4 px-4 md:px-8 flex items-center justify-center text-sm font-medium whitespace-nowrap ${
                        option.id === "now"
                          ? "bg-[#0e5aa7] text-white rounded-t-lg"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {option.icon === "truck" && <Truck className="w-5 h-5 mr-2" />}
                      {option.icon === "clock" && <Clock className="w-5 h-5 mr-2" />}
                      {option.icon === "package" && <Package className="w-5 h-5 mr-2" />}
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main header */}
            <header className="bg-[#0e5aa7] text-white py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <Link href="/carrefour" className="flex-shrink-0">
                    <Image
                      src={config.logo || "/placeholder.svg"}
                      alt={config.logoAlt}
                      width={config.logoWidth}
                      height={config.logoHeight}
                      className="h-8 w-auto"
                    />
                  </Link>

                  {/* Search */}
                  <div className="flex-1 mx-4 lg:mx-8 hidden md:block">
                    <div className="relative">
                      <div className="flex items-center bg-white rounded-full overflow-hidden">
                        <Search className="w-5 h-5 text-gray-400 ml-4" />
                        <input
                          type="text"
                          placeholder={config.searchPlaceholder}
                          className="w-full py-3 pl-2 pr-4 focus:outline-none text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location - Hide on smaller screens */}
                  <div className="hidden lg:flex items-start mr-4">
                    <MapPin className="w-5 h-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{config.deliveryTime}</div>
                      <div className="text-sm font-medium">{config.location}</div>
                    </div>
                  </div>

                  {/* User menu - Hide on smaller screens */}
                  <div className="hidden md:flex items-center mr-4">
                    <User className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Login</span>
                  </div>

                  {/* Language selector - Hide on smaller screens */}
                  <div className="hidden md:flex items-center mr-4">
                    <button className="flex items-center">
                      <Image
                        src="/placeholder.svg"
                        alt="UAE Flag"
                        width={24}
                        height={24}
                        className="rounded-sm mr-1"
                      />
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cart */}
                  <div className="relative">
                    <button className="p-1">
                      <ShoppingBag className="w-6 h-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Mobile menu button */}
                  <button className="ml-4 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </header>

            {/* Navigation */}
            <nav className="bg-[#0e5aa7] text-white py-3">
              <div className="container mx-auto px-4">
                <div className="hidden md:flex items-center space-x-8 overflow-x-auto">
                  {config.navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="whitespace-nowrap text-sm font-medium hover:text-blue-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 bg-blue-800 text-white z-50 overflow-y-auto pt-16">
                <div className="container mx-auto px-4 py-4">
                  <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={config.searchPlaceholder}
                      className="w-full py-3 pl-10 pr-4 bg-white rounded-full focus:outline-none text-gray-700"
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Delivery Options</h3>
                    {config.deliveryOptions.map((option) => (
                      <Link
                        key={option.id}
                        href={`#${option.id}`}
                        className="flex items-center py-3 border-b border-blue-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {option.icon === "truck" && <Truck className="w-5 h-5 mr-3" />}
                        {option.icon === "clock" && <Clock className="w-5 h-5 mr-3" />}
                        {option.icon === "package" && <Package className="w-5 h-5 mr-3" />}
                        {option.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Categories</h3>
                    {config.navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block py-3 border-b border-blue-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <Link href="/login" className="flex items-center py-3 border-b border-blue-700">
                      <User className="h-5 w-5 mr-3" />
                      <span>Login & Register</span>
                    </Link>

                    <div className="flex items-center py-3">
                      <MapPin className="w-5 h-5 mr-3" />
                      <div>
                        <div className="text-sm">{config.deliveryTime}</div>
                        <div className="text-sm">{config.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )

      case "vox":
        return (
          <>
            {/* Top bar with cinema selector and language */}
            <div className="bg-[#000814] text-white py-3 border-b border-gray-800">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  {/* Cinema selector */}
                  <button className="flex items-center text-sm font-light">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {config.cinemaSelector}
                    <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
                  </button>

                  {/* Language selector */}
                  <div className="flex items-center">
                    <Link href="#" className="flex items-center">
                      <span className="text-sm">العربية</span>
                      <Image
                        src="/placeholder.svg"
                        alt="UAE Flag"
                        width={20}
                        height={15}
                        className="ml-2"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main navigation */}
            <header className="bg-[#000814] text-white py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <Link href="/vox" className="flex-shrink-0">
                    <Image
                      src={config.logo || "/placeholder.svg"}
                      alt={config.logoAlt}
                      width={config.logoWidth}
                      height={config.logoHeight}
                      className="h-8 w-auto"
                    />
                  </Link>

                  {/* Navigation */}
                  <nav className="hidden md:flex items-center ml-4 lg:ml-12 overflow-x-auto">
                    {config.navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-sm font-medium hover:text-gray-300 flex items-center px-2 lg:px-4 whitespace-nowrap"
                      >
                        {item.label}
                        {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-1 opacity-70" />}
                      </Link>
                    ))}
                  </nav>

                  <div className="flex items-center ml-auto">
                    {/* Search */}
                    <div className="hidden md:block relative mr-4">
                      <div className="flex items-center bg-white rounded-full overflow-hidden pr-2">
                        <input
                          type="text"
                          placeholder={config.searchPlaceholder}
                          className="w-32 lg:w-64 py-2 pl-4 pr-8 text-gray-900 placeholder-gray-500 focus:outline-none"
                        />
                        <Search className="w-5 h-5 text-gray-500" />
                      </div>
                    </div>

                    {/* Login/Sign Up - Hide text on small screens */}
                    <div className="hidden sm:flex items-center bg-[#1a1a24] rounded-full px-4 py-2">
                      <User className="h-5 w-5 mr-0 sm:mr-2 text-gray-300" />
                      <span className="text-sm font-medium hidden sm:inline">Login / Sign Up</span>
                    </div>

                    {/* Mobile login icon */}
                    <button className="p-2 sm:hidden">
                      <User className="h-5 w-5 text-gray-300" />
                    </button>

                    {/* Mobile menu button */}
                    <button className="ml-4 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                      {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 bg-[#0c0c17] text-white z-50 overflow-y-auto pt-16">
                <div className="container mx-auto px-4 py-4">
                  <div className="mb-4 relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder={config.searchPlaceholder}
                      className="w-full py-2 pl-4 pr-10 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  <div className="mb-6">
                    {config.navItems.map((item) => (
                      <div key={item.label} className="border-b border-gray-800">
                        <Link
                          href={item.href}
                          className="block py-3 text-white hover:text-gray-300 flex items-center justify-between"
                          onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                          {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <Link href="/login" className="flex items-center py-3 text-white hover:text-gray-300">
                      <User className="h-5 w-5 mr-3" />
                      <span>Login / Sign Up</span>
                    </Link>
                    <div className="flex items-center py-3">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-sm">{config.cinemaSelector}</span>
                    </div>
                  </div>
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-[#1a1a24]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )

      case "lego":
        return (
          <>
            {/* Top bar with Play Zone and Promo */}
            <div className="bg-[#e3f2fd] text-gray-800">
              <div className="max-w-[1450px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[4.0625rem] md:ml-8 lg:ml-[6rem] md:mr-8 lg:mr-[6rem] flex items-center justify-between h-12">
                {/* Play Zone */}
                <Link href="/play-zone" className="flex items-center py-3 text-sm font-medium bg-[#c7e6fb] px-4 h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">PLAY ZONE</span>
                </Link>

                {/* Promo Carousel - Hide on small screens */}
                <div className="hidden sm:flex flex-1 items-center justify-center">
                  <button className="p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center">
                    <Image
                      src="/placeholder.svg"
                      alt="Gift"
                      width={30}
                      height={30}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">
                      Free gift set when you purchase The Lord of the Rings: The Shire™ set*
                    </span>
                    <Link href="#" className="text-sm font-medium text-blue-600 ml-2">
                      Shop now
                    </Link>
                  </div>
                  <button className="p-1 ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Login and Rewards - Hide on small screens */}
                <div className="hidden sm:flex items-center space-x-4">
                  <Link href="/login" className="flex items-center text-sm font-medium">
                    <div className="w-5 h-5 bg-red-600 flex items-center justify-center rounded-sm mr-1.5">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    Log In
                  </Link>
                  <Link href="/rewards" className="flex items-center text-sm font-medium">
                    <div className="w-5 h-5 bg-yellow-500 flex items-center justify-center rounded-full mr-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    Brick Rewards
                  </Link>
                </div>
              </div>
            </div>

            {/* Main header */}
            <header
              className={`${config.primaryColor} ${config.textColor} py-4 shadow-sm transition-shadow ${
                isScrolled ? "shadow-md" : ""
              }`}
            >
              <div className="w-full">
                <div className="max-w-[1450px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[4.0625rem] md:ml-8 lg:ml-[6rem] md:mr-8 lg:mr-[6rem]">
                  <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                      <div className="p-1 rounded">
                        <Image
                          src={config.logo || "/placeholder.svg"}
                          alt={config.logoAlt}
                          width={config.logoWidth}
                          height={config.logoHeight}
                          className="h-10 w-auto"
                        />
                      </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8 ml-8">
                      {config.navItems.map((item) => (
                        <Link key={item.label} href={item.href} className="text-sm hover:opacity-80">
                          {item.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="flex items-center ml-auto">
                      {/* Search button */}
                      <button className="p-2 rounded-full hover:bg-yellow-500">
                        <Search className="w-5 h-5" />
                      </button>

                      {/* Wishlist - Hide on smallest screens */}
                      <button className="p-2 rounded-full hover:bg-yellow-500 relative ml-2 hidden sm:block">
                        <Heart className="w-5 h-5" />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                      </button>

                      {/* Cart */}
                      <button className="p-2 rounded-full hover:bg-yellow-500 relative ml-2">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </button>

                      {/* Location - Hide on small screens */}
                      <button className="p-2 rounded-full hover:bg-yellow-500 hidden md:flex items-center ml-2">
                        <span className="text-sm font-medium mr-1">{config.location}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Mobile menu button */}
                      <button className="ml-4 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 bg-yellow-300 z-50 pt-16 overflow-y-auto">
                <div className="container mx-auto px-4 py-4">
                  <div className="mb-6">
                    <div className="relative border-b border-yellow-400 pb-4 mb-4">
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full py-2 pl-10 pr-4 bg-white rounded-full focus:outline-none"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    </div>
                    {config.navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block py-3 font-bold text-lg border-b border-yellow-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-yellow-400">
                    <Link href="/login" className="flex items-center py-3 border-b border-yellow-400">
                      <div className="w-5 h-5 bg-red-600 flex items-center justify-center rounded-sm mr-3">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span>Log In</span>
                    </Link>
                    <Link href="/rewards" className="flex items-center py-3 border-b border-yellow-400">
                      <div className="w-5 h-5 bg-yellow-500 flex items-center justify-center rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <span>Brick Rewards</span>
                    </Link>
                  </div>
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-yellow-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )

      case "lululemon":
        return (
          <>
            {/* Promo banner */}
            <div className="bg-gray-100 text-gray-800 py-2.5">
              <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="text-sm">{config.promoMessages[0]}</div>
                <div className="flex items-center space-x-6">
                  <Link href="/track-order" className="text-sm">
                    Track Order
                  </Link>
                  <button className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    <span>United Arab Emirates (AED)</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main header */}
            <header className="bg-white py-5 border-b border-gray-200">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <Link href="/lululemon" className="flex-shrink-0 mr-4 md:mr-12">
                    <Image
                      src={config.logo || "/placeholder.svg"}
                      alt={config.logoAlt}
                      width={config.logoWidth}
                      height={config.logoHeight}
                      className="h-5 w-auto"
                    />
                  </Link>

                  {/* Navigation */}
                  <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
                    {config.navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-sm font-medium uppercase tracking-wide hover:opacity-80"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="flex items-center ml-auto space-x-2 md:space-x-4">
                    {/* Search - Hide on small screens */}
                    <div className="relative border-b border-gray-300 hidden md:flex items-center">
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-32 lg:w-48 py-1.5 pl-0 pr-8 bg-transparent focus:outline-none text-sm"
                      />
                      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Search icon for mobile */}
                    <button className="p-1 md:hidden">
                      <Search className="h-6 w-6" />
                    </button>

                    {/* User menu */}
                    <button className="p-1">
                      <User className="h-6 w-6" />
                    </button>

                    {/* Cart */}
                    <button className="p-1 relative">
                      <ShoppingBag className="w-6 h-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>

                    {/* Mobile menu button - only visible on mobile */}
                    <button className="ml-1 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                      {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto pt-16">
                <div className="container mx-auto px-4 py-4">
                  <div className="mb-4 relative border-b border-gray-200 pb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="mb-6">
                    {config.navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block py-3 font-medium uppercase border-b border-gray-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link
                      href="/track-order"
                      className="block py-3 text-sm border-b border-gray-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Track Order
                    </Link>
                    <button className="flex items-center w-full py-3 text-sm border-b border-gray-200">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>United Arab Emirates (AED)</span>
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </button>
                  </div>
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )

      case "that":
        return (
          <>
            {/* Promo banner */}
            <div className="bg-black text-white py-2.5">
              <div className="container mx-auto">
                <div className="flex items-center justify-center space-x-16">
                  <div className="text-xs font-medium uppercase">SAME DAY DELIVERY IN DUBAI*</div>
                  <div className="text-xs font-medium uppercase">SHOP NOW PAY LATER*</div>
                  <div className="text-xs font-medium uppercase">CLICK & COLLECT*</div>
                  <div className="text-xs font-medium uppercase">15% OFF YOUR FIRST ORDER - USE CODE: HELLO15</div>
                </div>
              </div>
            </div>

            {/* Main header */}
            <header className={`${config.primaryColor} ${config.textColor} py-4`}>
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  {/* Left section with categories - Hide on mobile */}
                  <div className="hidden md:flex items-center space-x-4">
                    {config.categories?.map((category) => (
                      <Link
                        key={category.label}
                        href={category.href}
                        className={`px-4 py-1 text-sm font-medium uppercase ${category.isActive ? "bg-yellow-400" : ""}`}
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>

                  {/* Center logo */}
                  <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <Link href="/that" className="flex-shrink-0">
                      <Image
                        src={config.logo || "/placeholder.svg"}
                        alt={config.logoAlt}
                        width={config.logoWidth}
                        height={config.logoHeight}
                        className="h-8 w-auto"
                      />
                    </Link>
                  </div>

                  {/* Right section with icons */}
                  <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="flex items-center">
                      <Search className="w-5 h-5" />
                      <span className="ml-2 text-sm hidden sm:inline">Search</span>
                    </div>

                    {/* Language selector - Hide on small screens */}
                    <div className="hidden sm:flex items-center">
                      <div className="flex items-center">
                        <Image
                          src="/placeholder.svg"
                          alt="UAE Flag"
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span className="ml-2 text-sm">EN</span>
                      </div>
                    </div>

                    {/* User menu */}
                    <Link href="/account">
                      <User className="h-5 w-5" />
                    </Link>

                    {/* Wishlist - Hide on smallest screens */}
                    <Link href="/wishlist" className="relative hidden sm:block">
                      <Heart className="w-5 h-5" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className="relative">
                      <ShoppingBag className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    {/* Mobile menu button - only visible on mobile */}
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                      {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Navigation - Hide on mobile */}
            <nav className="py-3 hidden md:block">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-center space-x-6 overflow-x-auto">
                  {config.navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn("text-sm whitespace-nowrap hover:opacity-80", item.className)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto pt-16">
                <div className="container mx-auto px-4 py-4">
                  <div className="mb-4 relative border-b border-gray-200 pb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3">Shop by Category</h3>
                    {config.categories?.map((category) => (
                      <Link
                        key={category.label}
                        href={category.href}
                        className={`block py-2 text-base ${category.isActive ? "font-bold" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    {config.navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn("block py-2 text-base border-b border-gray-100", item.className)}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t mt-6 pt-4">
                    <Link href="/account" className="flex items-center py-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-5 w-5 mr-3" />
                      <span>My Account</span>
                    </Link>
                    <div className="flex items-center py-2">
                      <Image
                        src="/placeholder.svg"
                        alt="UAE Flag"
                        width={20}
                        height={20}
                        className="rounded-full mr-3"
                      />
                      <span>English</span>
                    </div>
                  </div>
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        )

      default:
        return null
    }
  }

  return <div className="header-wrapper">{renderHeader()}</div>
}
