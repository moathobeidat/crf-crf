import { MapPin, Clock } from "lucide-react";

interface LocationBadgeProps {
  location: string;
  deliveryTime?: string;
  variant?: "icon" | "text" | "both";
  className?: string;
}

export function LocationBadge({
  location,
  deliveryTime,
  variant = "both",
  className = "",
}: LocationBadgeProps) {
  const renderContent = () => {
    if (variant === "icon") {
      return <MapPin className="h-5 w-5" />;
    }

    if (variant === "text") {
      return (
        <div className="flex flex-col">
          <span className="text-sm">{location}</span>
          {deliveryTime && <span className="text-xs text-gray-500">{deliveryTime}</span>}
        </div>
      );
    }

    return (
      <div className="flex items-start">
        <MapPin className="h-5 w-5 mr-2 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-sm">{location}</span>
          {deliveryTime && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{deliveryTime}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return <div className={`flex items-center ${className}`}>{renderContent()}</div>;
}
