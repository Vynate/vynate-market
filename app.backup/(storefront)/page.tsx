import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample data - In production, fetch from API
const featuredCategories = [
  { name: "Electronics", slug: "electronics", image: "/categories/electronics.jpg", count: 1250 },
  { name: "Fashion", slug: "fashion", image: "/categories/fashion.jpg", count: 3420 },
  { name: "Home & Garden", slug: "home-garden", image: "/categories/home.jpg", count: 890 },
  { name: "Sports", slug: "sports", image: "/categories/sports.jpg", count: 560 },
  { name: "Beauty", slug: "beauty", image: "/categories/beauty.jpg", count: 720 },
  { name: "Toys", slug: "toys", image: "/categories/toys.jpg", count: 430 },
];

const featuredProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 128,
    image: "/products/headphones.jpg",
    vendor: "TechStore",
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    slug: "smart-watch-pro",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 89,
    image: "/products/smartwatch.jpg",
    vendor: "GadgetHub",
    badge: "New",
  },
  {
    id: "3",
    name: "Portable Power Bank 20000mAh",
    slug: "portable-power-bank",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.3,
    reviews: 256,
    image: "/products/powerbank.jpg",
    vendor: "PowerTech",
    badge: "Sale",
  },
  {
    id: "4",
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    price: 29.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 67,
    image: "/products/charger.jpg",
    vendor: "TechStore",
    badge: null,
  },
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: ShoppingBag,
    title: "24/7 Support",
    description: "Dedicated support",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm">
                🎉 New Season Collection
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Discover Quality Products from{" "}
                <span className="text-primary">Trusted Sellers</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Shop thousands of products from verified vendors worldwide.
                Quality guaranteed, fast shipping, and excellent customer service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/become-seller">Become a Seller</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold">10K+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">Vendors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-muted">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="h-24 w-24 opacity-20" />
              </div>
              {/* Add actual hero image in production */}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">
              Browse our most popular categories
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/categories">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-square relative bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  {/* Add category images in production */}
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.count.toLocaleString()} products
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-1">
              Hand-picked products just for you
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/shop">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group"
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-square relative bg-muted">
                  {product.badge && (
                    <Badge
                      className="absolute top-2 left-2 z-10"
                      variant={
                        product.badge === "Sale" ? "destructive" : "secondary"
                      }
                    >
                      {product.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  {/* Add product images in production */}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{product.vendor}</p>
                  <h3 className="font-medium mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Selling on Vynate Today
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-lg">
              Join thousands of successful vendors and reach millions of customers
              worldwide. Low fees, powerful tools, and dedicated support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/become-seller">
                  Become a Seller
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/seller-info">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
