"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Settings,
  MessageSquare,
  Star,
  Truck,
  Tag,
  LogOut,
  Bell,
  HelpCircle,
  Store,
  Users,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const vendorNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
    badge: "5",
  },
  {
    title: "Products",
    icon: Package,
    children: [
      { title: "All Products", href: "/vendor/products" },
      { title: "Add Product", href: "/vendor/products/new" },
      { title: "Inventory", href: "/vendor/inventory" },
    ],
  },
  {
    title: "Promotions",
    icon: Tag,
    children: [
      { title: "Coupons", href: "/vendor/coupons" },
      { title: "Flash Sales", href: "/vendor/flash-sales" },
    ],
  },
  {
    title: "Reviews",
    href: "/vendor/reviews",
    icon: Star,
  },
  {
    title: "Messages",
    href: "/vendor/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    title: "Earnings",
    icon: DollarSign,
    children: [
      { title: "Overview", href: "/vendor/earnings" },
      { title: "Payouts", href: "/vendor/payouts" },
      { title: "Transactions", href: "/vendor/transactions" },
    ],
  },
  {
    title: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3,
  },
  {
    title: "Shipping",
    href: "/vendor/shipping",
    icon: Truck,
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Store Profile", href: "/vendor/settings" },
      { title: "Bank Details", href: "/vendor/settings/bank" },
      { title: "Notifications", href: "/vendor/settings/notifications" },
    ],
  },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const vendorInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "V";

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <TextLogo size="md" href="/vendor" />
      </div>

      {/* Store info */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{vendorInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {session?.user?.name || "Vendor Store"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {vendorNavItems.map((item) => (
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
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Store className="mr-2 h-4 w-4" />
            View Storefront
          </Button>
        </Link>
        <Link href="/vendor/help">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Center
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
