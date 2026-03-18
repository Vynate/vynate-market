import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if accessing auth pages (login/register)
  // Those have their own layout and don't need sidebar
  
  return <>{children}</>;
}
