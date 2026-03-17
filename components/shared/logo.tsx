import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white" | "icon";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizeClasses = {
  sm: { width: 100, height: 32 },
  md: { width: 140, height: 44 },
  lg: { width: 180, height: 56 },
};

export function Logo({
  variant = "default",
  size = "md",
  href = "/",
  className,
}: LogoProps) {
  const { width, height } = sizeClasses[size];

  const logoContent = (
    <div className={cn("flex items-center", className)}>
      {/* SVG Logo - Replace with actual logo */}
      <svg
        width={variant === "icon" ? height : width}
        height={height}
        viewBox="0 0 140 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-colors"
      >
        {/* Icon part */}
        <rect
          x="0"
          y="8"
          width="28"
          height="28"
          rx="6"
          className={cn(
            variant === "white" ? "fill-white" : "fill-primary"
          )}
        />
        <path
          d="M8 22L12 26L20 18"
          stroke={variant === "white" ? "#2563eb" : "white"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Text part - hidden for icon variant */}
        {variant !== "icon" && (
          <text
            x="36"
            y="30"
            className={cn(
              "text-[24px] font-bold",
              variant === "white" ? "fill-white" : "fill-foreground"
            )}
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Vynate
          </text>
        )}
      </svg>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

// Alternative text-based logo
export function TextLogo({
  size = "md",
  href = "/",
  className,
}: Omit<LogoProps, "variant">) {
  const fontSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const content = (
    <span
      className={cn(
        "font-bold tracking-tight",
        fontSizes[size],
        className
      )}
    >
      <span className="text-primary">Vy</span>
      <span>nate</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        {content}
      </Link>
    );
  }

  return content;
}
