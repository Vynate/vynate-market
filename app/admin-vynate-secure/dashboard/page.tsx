import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Orders",
    value: "2,350",
    change: "+15.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Customers",
    value: "12,234",
    change: "+8.1%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Active Vendors",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Store,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", amount: "$125.00", status: "Completed", date: "2 hours ago" },
  { id: "ORD-002", customer: "Jane Smith", amount: "$89.00", status: "Processing", date: "3 hours ago" },
  { id: "ORD-003", customer: "Bob Wilson", amount: "$245.00", status: "Pending", date: "5 hours ago" },
  { id: "ORD-004", customer: "Alice Brown", amount: "$67.00", status: "Shipped", date: "1 day ago" },
];

const pendingVendors = [
  { name: "TechGadgets Pro", email: "tech@example.com", date: "Today" },
  { name: "Fashion Hub", email: "fashion@example.com", date: "Yesterday" },
  { name: "Home Essentials", email: "home@example.com", date: "2 days ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your marketplace.
          </p>
        </div>
        <Button>Download Report</Button>
      </div>

      {/* Stats Grid */}
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
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders across all vendors</CardDescription>
            </div>
            <Link href="/admin-vynate-secure/orders">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <Badge
                      variant={
                        order.status === "Completed" ? "default" :
                        order.status === "Processing" ? "secondary" :
                        order.status === "Shipped" ? "outline" : "destructive"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Vendor Applications */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Pending Vendors
              </CardTitle>
              <CardDescription>Applications awaiting approval</CardDescription>
            </div>
            <Link href="/admin-vynate-secure/vendors">
              <Button variant="outline" size="sm">Review All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVendors.map((vendor) => (
                <div key={vendor.email} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
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
            <Link href="/admin-vynate-secure/products">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Package className="h-5 w-5" />
                <span>Manage Products</span>
              </Button>
            </Link>
            <Link href="/admin-vynate-secure/vendors">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Store className="h-5 w-5" />
                <span>Manage Vendors</span>
              </Button>
            </Link>
            <Link href="/admin-vynate-secure/orders">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>View Orders</span>
              </Button>
            </Link>
            <Link href="/admin-vynate-secure/settings">
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
