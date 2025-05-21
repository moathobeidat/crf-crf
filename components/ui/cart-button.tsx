import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "./badge";

interface CartButtonProps {
  count?: number;
  variant?: "icon" | "text" | "both";
  className?: string;
}

export function CartButton({ count = 0, variant = "both", className = "" }: CartButtonProps) {
  const renderContent = () => {
    if (variant === "icon") {
      return (
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {count}
            </Badge>
          )}
        </div>
      );
    }

    if (variant === "text") {
      return <span>Cart {count > 0 ? `(${count})` : ""}</span>;
    }

    return (
      <div className="flex items-center">
        <div className="relative mr-2">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {count}
            </Badge>
          )}
        </div>
        <span>Cart</span>
      </div>
    );
  };

  return (
    <Link href="/cart" className={`flex items-center ${className}`}>
      {renderContent()}
    </Link>
  );
}
