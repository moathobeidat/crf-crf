import Link from "next/link";
import { User } from "lucide-react";

interface UserMenuProps {
  isLoggedIn?: boolean;
  username?: string;
  variant?: "icon" | "text" | "both";
  className?: string;
}

export function UserMenu({
  isLoggedIn = false,
  username = "",
  variant = "both",
  className = "",
}: UserMenuProps) {
  const renderContent = () => {
    if (variant === "icon") {
      return <User className="h-5 w-5" />;
    }

    if (variant === "text") {
      return isLoggedIn ? username : "Login / Register";
    }

    return (
      <div className="flex items-center">
        <User className="h-5 w-5 mr-2" />
        <span>{isLoggedIn ? username : "Login / Register"}</span>
      </div>
    );
  };

  return (
    <Link href="/account" className={`flex items-center ${className}`}>
      {renderContent()}
    </Link>
  );
}
