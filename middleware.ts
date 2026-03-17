import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/products",
  "/products/(.*)",
  "/store/(.*)",
  "/category/(.*)",
  "/brand/(.*)",
  "/search",
  "/cart",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password/(.*)",
  "/verify-email/(.*)",
  "/api/auth/(.*)",
  "/api/products(.*)",
  "/api/categories(.*)",
  "/api/brands(.*)",
  "/api/webhooks/(.*)",
  "/api/cron/(.*)",
];

// Routes that require specific roles
const adminRoutes = ["/admin", "/admin/(.*)"];
const vendorRoutes = ["/vendor", "/vendor/(.*)"];
const accountRoutes = ["/account", "/account/(.*)"];

function matchRoute(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    const regex = new RegExp(`^${pattern.replace(/\(.*\)/g, ".*")}$`);
    return regex.test(pathname);
  });
}

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth;

  // Allow public routes
  if (matchRoute(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  // Allow static files and api routes that are public
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check authentication
  if (!session?.user) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.user.role;
  const vendorStatus = session.user.vendorStatus;

  // Admin routes - only for ADMIN role
  if (matchRoute(pathname, adminRoutes)) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Vendor routes - only for VENDOR role
  if (matchRoute(pathname, vendorRoutes)) {
    if (userRole !== "VENDOR") {
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    }

    // Handle vendor status redirects
    if (vendorStatus === "PENDING" && !pathname.includes("/vendor/pending")) {
      return NextResponse.redirect(new URL("/vendor/pending", nextUrl.origin));
    }
    if (vendorStatus === "REJECTED" && !pathname.includes("/vendor/rejected")) {
      return NextResponse.redirect(new URL("/vendor/rejected", nextUrl.origin));
    }
    if (vendorStatus === "SUSPENDED" || vendorStatus === "BANNED") {
      return NextResponse.redirect(new URL("/vendor/suspended", nextUrl.origin));
    }

    // Allow onboarding for vendors without status
    if (!vendorStatus && !pathname.includes("/vendor/onboarding")) {
      return NextResponse.redirect(new URL("/vendor/onboarding", nextUrl.origin));
    }

    return NextResponse.next();
  }

  // Account routes - for authenticated CUSTOMER role
  if (matchRoute(pathname, accountRoutes)) {
    if (userRole !== "CUSTOMER") {
      // Redirect admins and vendors to their respective dashboards
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", nextUrl.origin));
      }
      if (userRole === "VENDOR") {
        return NextResponse.redirect(new URL("/vendor", nextUrl.origin));
      }
    }
    return NextResponse.next();
  }

  // Checkout route - allow authenticated users
  if (pathname === "/checkout") {
    return NextResponse.next();
  }

  // Default - allow authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
