import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { KeepAliveProvider } from "@/components/shared/keep-alive-provider";
import { ToastContainer } from "@/components/shared/toast-container";
import { CartSidebar } from "@/components/layout/cart-sidebar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vynate.com"),
  title: {
    default: "Vynate - Your Global Marketplace",
    template: "%s | Vynate",
  },
  description:
    "Discover quality products from trusted sellers worldwide. Shop electronics, fashion, home goods and more at Vynate.",
  keywords: [
    "marketplace",
    "ecommerce",
    "online shopping",
    "dropshipping",
    "multi-vendor",
  ],
  authors: [{ name: "Vynate" }],
  creator: "Vynate",
  publisher: "Vynate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Vynate",
    title: "Vynate - Your Global Marketplace",
    description:
      "Discover quality products from trusted sellers worldwide. Shop electronics, fashion, home goods and more at Vynate.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vynate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vynate - Your Global Marketplace",
    description:
      "Discover quality products from trusted sellers worldwide.",
    images: ["/og-image.png"],
    creator: "@vynate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <KeepAliveProvider>
            {children}
            <CartSidebar />
            <ToastContainer />
          </KeepAliveProvider>
        </Providers>
      </body>
    </html>
  );
}
