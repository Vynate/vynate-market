"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useUIStore } from "@/store/ui.store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    vendorProductId: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    image?: string | null;
    rating?: number;
    reviewCount?: number;
    vendor: {
      id: string;
      name: string;
      slug: string;
    };
    stockQty: number;
    badge?: string | null;
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { addToast } = useUIStore();
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stockQty <= 0) {
      addToast({
        type: "error",
        title: "Out of stock",
        message: "This product is currently unavailable.",
      });
      return;
    }

    addToCart({
      vendorProductId: product.vendorProductId,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      vendorId: product.vendor.id,
      vendorName: product.vendor.name,
      quantity: 1,
      unitPrice: product.price,
      productImage: product.image || "",
      stockQty: product.stockQty,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    addToast({
      type: isWishlisted ? "info" : "success",
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      message: product.name,
    });
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all hover:shadow-lg",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.badge && (
              <Badge
                variant={product.badge === "Sale" ? "destructive" : "secondary"}
              >
                {product.badge}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive">-{discount}%</Badge>
            )}
            {product.stockQty <= 0 && (
              <Badge variant="outline" className="bg-background">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
              isWishlisted && "opacity-100"
            )}
            onClick={handleWishlist}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isWishlisted && "fill-red-500 text-red-500"
              )}
            />
          </Button>

          {/* Product image */}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Quick actions overlay */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
              isHovered && "opacity-100"
            )}
          >
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stockQty <= 0 || isInCart(product.vendorProductId)}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {isInCart(product.vendorProductId) ? "In Cart" : "Add to Cart"}
              </Button>
              <Button size="sm" variant="secondary">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{product.vendor.name}</p>
          <h3 className="font-medium mt-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
              {product.reviewCount !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-lg">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
