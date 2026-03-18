"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  Star,
  Store,
  Plus,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/vendor/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
  },
  {
    name: "Earnings",
    href: "/vendor/earnings",
    icon: DollarSign,
  },
  {
    name: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3,
  },
  {
    name: "Reviews",
    href: "/vendor/reviews",
    icon: Star,
  },
  {
    name: "Messages",
    href: "/vendor/messages",
    icon: MessageSquare,
  },
  {
    name: "Store Settings",
    href: "/vendor/settings",
    icon: Settings,
  },
];

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-800 border-r">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg font-heading">Vynate</h1>
          <p className="text-xs text-muted-foreground">Seller Center</p>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="p-4">
        <Link href="/vendor/products/new">
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t">
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">Need Help?</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Check our seller guide or contact support
          </p>
          <Link href="/vendor/help">
            <Button variant="outline" size="sm" className="w-full">
              Seller Guide
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
