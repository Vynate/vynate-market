"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Gift,
  MessageSquare,
  Star,
  Wallet,
  Shield,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const accountNavItems = [
  {
    title: "Account Overview",
    href: "/account",
    icon: User,
  },
  {
    title: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    title: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Payment Methods",
    href: "/account/payments",
    icon: CreditCard,
  },
  {
    title: "Wallet",
    href: "/account/wallet",
    icon: Wallet,
  },
  {
    title: "Reviews",
    href: "/account/reviews",
    icon: Star,
  },
  {
    title: "Messages",
    href: "/account/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    href: "/account/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="w-full lg:w-64 lg:flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* User info */}
        <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
          <Avatar className="h-14 w-14">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {accountNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "font-medium"
                  )}
                  size="sm"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Sign out */}
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
