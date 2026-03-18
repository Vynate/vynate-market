import {
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  TrendingUp,
  ArrowUpRight,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const stats = [
  {
    title: "Total Earnings",
    value: "$12,450.00",
    change: "+18.2%",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Orders",
    value: "156",
    change: "+12.5%",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Products",
    value: "48",
    change: "+4 this week",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Avg. Rating",
    value: "4.8",
    change: "+0.2",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
];

const recentOrders = [
  { id: "ORD-2001", product: "Wireless Headphones", customer: "John D.", amount: "$79.99", status: "Processing" },
  { id: "ORD-2002", product: "Smart Watch", customer: "Sarah M.", amount: "$199.99", status: "Shipped" },
  { id: "ORD-2003", product: "Power Bank", customer: "Mike R.", amount: "$39.99", status: "Delivered" },
  { id: "ORD-2004", product: "USB-C Cable", customer: "Emily K.", amount: "$24.99", status: "Processing" },
];

const topProducts = [
  { name: "Wireless Bluetooth Headphones", sales: 89, revenue: "$7,111" },
  { name: "Smart Watch Pro", sales: 56, revenue: "$11,199" },
  { name: "Portable Power Bank", sales: 124, revenue: "$4,956" },
  { name: "USB-C Fast Charger", sales: 78, revenue: "$2,340" },
];

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your store performance overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Store
          </Button>
          <Link href="/vendor/products/new">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Payout */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Payout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">$2,450.00</p>
              <p className="text-sm text-muted-foreground">Next payout: March 20, 2026</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Minimum threshold</p>
              <Progress value={75} className="w-32 h-2" />
              <p className="text-xs text-muted-foreground mt-1">$75 / $100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders & Top Products */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest customer orders</CardDescription>
            </div>
            <Link href="/vendor/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.product}</p>
                      <Badge
                        variant={
                          order.status === "Delivered" ? "default" :
                          order.status === "Shipped" ? "secondary" : "outline"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.id} • {order.customer}</p>
                  </div>
                  <p className="font-medium">{order.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing items</CardDescription>
            </div>
            <Link href="/vendor/analytics">
              <Button variant="ghost" size="sm">Analytics</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/vendor/products/new">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Package className="h-5 w-5" />
                <span>Add Product</span>
              </Button>
            </Link>
            <Link href="/vendor/orders">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Manage Orders</span>
              </Button>
            </Link>
            <Link href="/vendor/messages">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </Button>
            </Link>
            <Link href="/vendor/analytics">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
