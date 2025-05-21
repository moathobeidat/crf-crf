import { Search } from "lucide-react";
import { Input } from "./input";

interface SearchBarProps {
  placeholder?: string;
  variant?: "default" | "rounded" | "pill";
  className?: string;
  darkMode?: boolean;
}

export function SearchBar({
  placeholder = "Search",
  variant = "default",
  className = "",
  darkMode = false,
}: SearchBarProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "rounded":
        return "rounded-lg";
      case "pill":
        return "rounded-full";
      default:
        return "rounded-md";
    }
  };

  const getBgColor = () => {
    if (darkMode) return "bg-gray-800 text-white";
    return "bg-white text-gray-900";
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        className={`pl-10 pr-4 py-2 ${getVariantClasses()} ${getBgColor()} w-full`}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
    </div>
  );
}
