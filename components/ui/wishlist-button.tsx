import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "./badge";

interface WishlistButtonProps {
  count?: number;
  variant?: "icon" | "text" | "both";
  className?: string;
}

export function WishlistButton({
  count = 0,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const renderContent = () => {
    if (variant === "icon") {
      return (
        <div className="relative">
          <Heart className="h-5 w-5" />
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
      return <span>Wishlist {count > 0 ? `(${count})` : ""}</span>;
    }

    return (
      <div className="flex items-center">
        <div className="relative mr-2">
          <Heart className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {count}
            </Badge>
          )}
        </div>
        <span>Wishlist</span>
      </div>
    );
  };

  return (
    <Link href="/wishlist" className={`flex items-center ${className}`}>
      {renderContent()}
    </Link>
  );
}
