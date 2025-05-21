import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  href?: string;
  className?: string;
}

export function Logo({
  src,
  alt,
  width = 120,
  height = 40,
  href = "/",
  className = "",
}: LogoProps) {
  return (
    <Link href={href} className={`block ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
      />
    </Link>
  );
}
