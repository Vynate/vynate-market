"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Tag,
  Ticket,
  BarChart3,
  Settings,
  Megaphone,
  MessageSquare,
  FileText,
  Shield,
  CreditCard,
  Truck,
  Palette,
  ChevronDown,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextLogo } from "@/components/shared/logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: { title: string; href: string }[];
}

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    badge: "12",
  },
  {
    title: "Products",
    icon: Package,
    children: [
      { title: "All Products", href: "/admin/products" },
      { title: "Categories", href: "/admin/categories" },
      { title: "Brands", href: "/admin/brands" },
      { title: "Attributes", href: "/admin/attributes" },
    ],
  },
  {
    title: "Vendors",
    icon: Store,
    children: [
      { title: "All Vendors", href: "/admin/vendors" },
      { title: "Applications", href: "/admin/vendors/applications" },
      { title: "Payouts", href: "/admin/vendors/payouts" },
    ],
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Marketing",
    icon: Megaphone,
    children: [
      { title: "Coupons", href: "/admin/coupons" },
      { title: "Flash Sales", href: "/admin/flash-sales" },
      { title: "Banners", href: "/admin/banners" },
      { title: "Email Templates", href: "/admin/emails" },
    ],
  },
  {
    title: "Reviews & Q&A",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    icon: BarChart3,
    children: [
      { title: "Sales Report", href: "/admin/reports/sales" },
      { title: "Products Report", href: "/admin/reports/products" },
      { title: "Vendors Report", href: "/admin/reports/vendors" },
      { title: "Customers Report", href: "/admin/reports/customers" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "General", href: "/admin/settings" },
      { title: "Payments", href: "/admin/settings/payments" },
      { title: "Shipping", href: "/admin/settings/shipping" },
      { title: "Taxes", href: "/admin/settings/taxes" },
      { title: "Appearance", href: "/admin/settings/appearance" },
      { title: "Staff & Roles", href: "/admin/settings/staff" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <TextLogo size="md" href="/admin" />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {adminNavItems.map((item) => (
            <NavItemComponent
              key={item.title}
              item={item}
              pathname={pathname}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom actions */}
      <div className="border-t p-3 space-y-1">
        <Link href="/admin/notifications">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </Link>
        <Link href="/admin/help">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function NavItemComponent({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isActive = item.href
    ? pathname === item.href
    : item.children?.some((child) => pathname === child.href);

  const [isOpen, setIsOpen] = React.useState(isActive);

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between",
              isActive && "bg-muted"
            )}
            size="sm"
          >
            <span className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-6 pt-1">
          {item.children.map((child) => (
            <Link key={child.href} href={child.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start",
                  pathname === child.href && "bg-muted font-medium"
                )}
              >
                {child.title}
              </Button>
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link href={item.href!}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isActive && "bg-muted font-medium"
        )}
        size="sm"
      >
        <item.icon className="mr-2 h-4 w-4" />
        {item.title}
        {item.badge && (
          <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
            {item.badge}
          </span>
        )}
      </Button>
    </Link>
  );
}
