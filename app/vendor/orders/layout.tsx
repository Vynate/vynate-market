import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";
import { VendorHeader } from "@/components/vendor/vendor-header";

export default async function VendorOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    redirect("/vendor/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <VendorSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <VendorHeader user={session.user} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
