"use client";

import { useState } from "react";
import { Calendar, Clock, Truck } from "lucide-react";

interface DeliveryOption {
  id: string;
  label: string;
  icon: "scheduled" | "now" | "electronics";
}

interface DeliveryOptionsProps {
  options: DeliveryOption[];
  defaultSelected?: string;
  className?: string;
}

export function DeliveryOptions({
  options,
  defaultSelected = "",
  className = "",
}: DeliveryOptionsProps) {
  const [selected, setSelected] = useState(
    defaultSelected || (options.length > 0 ? options[0].id : "")
  );

  const getIcon = (icon: string) => {
    switch (icon) {
      case "scheduled":
        return <Calendar className="h-5 w-5 mr-2" />;
      case "now":
        return <Clock className="h-5 w-5 mr-2" />;
      case "electronics":
        return <Truck className="h-5 w-5 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
            selected === option.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-primary/10 text-foreground"
          }`}
          onClick={() => setSelected(option.id)}
        >
          {getIcon(option.icon)}
          {option.label}
        </button>
      ))}
    </div>
  );
}
