"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Settings,
  DollarSign,
  BarChart3,
  MessageSquare,
  Bell,
  Tag,
  Layers,
  Shield,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin-vynate-secure/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin-vynate-secure/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin-vynate-secure/categories",
    icon: Layers,
  },
  {
    name: "Orders",
    href: "/admin-vynate-secure/orders",
    icon: ShoppingCart,
  },
  {
    name: "Vendors",
    href: "/admin-vynate-secure/vendors",
    icon: Store,
  },
  {
    name: "Customers",
    href: "/admin-vynate-secure/customers",
    icon: Users,
  },
  {
    name: "Payouts",
    href: "/admin-vynate-secure/payouts",
    icon: DollarSign,
  },
  {
    name: "Promotions",
    href: "/admin-vynate-secure/promotions",
    icon: Tag,
  },
  {
    name: "Analytics",
    href: "/admin-vynate-secure/analytics",
    icon: BarChart3,
  },
  {
    name: "Messages",
    href: "/admin-vynate-secure/messages",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/admin-vynate-secure/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg font-heading">Vynate</h1>
          <p className="text-xs text-slate-400">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
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
                      ? "bg-primary text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
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

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Link href="/" target="_blank">
          <button className="w-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            View Storefront →
          </button>
        </Link>
      </div>
    </aside>
  );
}
