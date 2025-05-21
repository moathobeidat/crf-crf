import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface NavigationItemProps {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  className?: string;
}

export function NavigationItem({
  label,
  href,
  hasDropdown = false,
  isActive = false,
  className = "",
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors hover:bg-opacity-10 ${
        isActive ? "font-semibold" : ""
      } ${className}`}
    >
      {label}
      {hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
    </Link>
  );
}
