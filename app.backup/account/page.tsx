import { auth } from "@/lib/auth";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  ArrowRight,
  Star,
  Gift,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const recentOrders = [
  {
    id: "ORD-12345",
    date: "March 10, 2026",
    status: "Delivered",
    total: "$125.00",
    items: 3,
  },
  {
    id: "ORD-12344",
    date: "March 5, 2026",
    status: "Shipped",
    total: "$89.00",
    items: 2,
  },
  {
    id: "ORD-12343",
    date: "February 28, 2026",
    status: "Delivered",
    total: "$245.00",
    items: 5,
  },
];

const quickLinks = [
  { title: "Orders", href: "/account/orders", icon: Package, count: "12" },
  { title: "Wishlist", href: "/account/wishlist", icon: Heart, count: "5" },
  { title: "Addresses", href: "/account/addresses", icon: MapPin, count: "2" },
  { title: "Payments", href: "/account/payments", icon: CreditCard, count: "3" },
];

export default async function AccountPage() {
  const session = await auth();

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                Welcome back, {session?.user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">{session?.user?.email}</p>
            </div>
            <Link href="/account/settings">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{link.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {link.count} items
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Rewards & Wallet */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Loyalty Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">1,250</p>
                <p className="text-sm text-muted-foreground">
                  Points available
                </p>
              </div>
              <Link href="/account/rewards">
                <Button variant="outline" size="sm">
                  Redeem Points
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">$25.00</p>
                <p className="text-sm text-muted-foreground">
                  Available balance
                </p>
              </div>
              <Link href="/account/wallet">
                <Button variant="outline" size="sm">
                  Add Funds
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/account/orders">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
              <Link href="/shop">
                <Button className="mt-4">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.id}</p>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "success"
                            : order.status === "Shipped"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.date} • {order.items} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Stay updated</p>
              <p className="text-sm text-muted-foreground">
                Get notified about orders, deals, and more
              </p>
            </div>
          </div>
          <Link href="/account/notifications">
            <Button size="sm">Manage Notifications</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
