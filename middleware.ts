import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes - no auth needed
  const publicRoutes = [
    "/",
    "/products",
    "/category",
    "/brand",
    "/search",
    "/cart",
    "/login",
    "/register",
    "/forgot-password",
    "/vendor/auth/login",
    "/vendor/auth/register",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isApiAuth = pathname.startsWith("/api/auth");
  const isPublicApi = pathname.startsWith("/api/products") || 
                      pathname.startsWith("/api/categories") ||
                      pathname.startsWith("/api/brands");
  const isStaticFile = pathname.includes(".");

  // Allow public routes
  if (isPublicRoute || isApiAuth || isPublicApi || isStaticFile) {
    return NextResponse.next();
  }

  // Admin secure portal
  if (pathname.startsWith("/admin-vynate-secure")) {
    // Admin login page - allow without auth
    if (pathname === "/admin-vynate-secure/login") {
      if (token && token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin-vynate-secure/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Other admin pages - require ADMIN role
    if (!token) {
      return NextResponse.redirect(new URL("/admin-vynate-secure/login", request.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Vendor portal
  if (pathname.startsWith("/vendor")) {
    // Vendor auth pages - allow without auth
    if (pathname.startsWith("/vendor/auth")) {
      if (token && token.role === "VENDOR") {
        return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Other vendor pages - require VENDOR role
    if (!token) {
      return NextResponse.redirect(new URL("/vendor/auth/login", request.url));
    }
    if (token.role !== "VENDOR" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Customer account pages
  if (pathname.startsWith("/account")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Checkout - require auth
  if (pathname.startsWith("/checkout")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-vynate-secure/:path*",
    "/vendor/:path*",
    "/account/:path*",
    "/checkout/:path*",
  ],
};
