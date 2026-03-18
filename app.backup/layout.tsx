import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://vynate.com"),
  title: {
    default: "Vynate - Your Global Marketplace",
    template: "%s | Vynate",
  },
  description: "Discover quality products from trusted sellers worldwide.",
  keywords: ["marketplace", "ecommerce", "online shopping", "multi-vendor"],
  authors: [{ name: "Vynate" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
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
