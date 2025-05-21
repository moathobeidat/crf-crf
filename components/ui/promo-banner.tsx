"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PromoBannerProps {
  messages: string[];
  autoRotate?: boolean;
  rotationInterval?: number;
  showControls?: boolean;
  allowDismiss?: boolean;
  className?: string;
}

export function PromoBanner({
  messages,
  autoRotate = true,
  rotationInterval = 5000,
  showControls = false,
  allowDismiss = true,
  className = "",
}: PromoBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoRotate || messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, messages.length, rotationInterval]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  if (!isVisible || messages.length === 0) return null;

  return (
    <div className={`relative flex items-center justify-center py-2 ${className}`}>
      {showControls && messages.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Previous message"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <p className="text-sm text-center">{messages[currentIndex]}</p>

      {showControls && messages.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Next message"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {allowDismiss && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
