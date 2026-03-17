import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

/**
 * Get the current session user (server-side)
 */
export async function getServerUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Get the current session (server-side)
 */
export async function getServerSession() {
  return auth();
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(callbackUrl?: string) {
  const user = await getServerUser();
  
  if (!user) {
    const url = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";
    redirect(url);
  }
  
  return user;
}

/**
 * Require a specific role - redirect if not authorized
 */
export async function requireRole(role: Role, redirectUrl: string = "/") {
  const user = await requireAuth();
  
  if (user.role !== role) {
    redirect(redirectUrl);
  }
  
  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireRole("ADMIN", "/");
}

/**
 * Require vendor role
 */
export async function requireVendor() {
  const user = await requireRole("VENDOR", "/");
  
  // Check vendor status
  if (user.vendorStatus === "PENDING") {
    redirect("/vendor/pending");
  }
  
  if (user.vendorStatus === "REJECTED") {
    redirect("/vendor/rejected");
  }
  
  if (user.vendorStatus === "SUSPENDED" || user.vendorStatus === "BANNED") {
    redirect("/vendor/suspended");
  }
  
  if (!user.vendorStatus) {
    redirect("/vendor/onboarding");
  }
  
  return user;
}

/**
 * Require customer role
 */
export async function requireCustomer() {
  return requireRole("CUSTOMER", "/");
}

/**
 * Check if user has admin permission
 */
export async function checkAdminPermission(
  permission: string,
  action?: string
): Promise<boolean> {
  const user = await getServerUser();
  
  if (!user || user.role !== "ADMIN") {
    return false;
  }
  
  // Super admin has all permissions
  const adminProfile = await db.adminProfile.findUnique({
    where: { userId: user.id },
  });
  
  if (!adminProfile?.permissions) {
    return false;
  }
  
  const permissions = adminProfile.permissions as Record<string, unknown>;
  
  // Check for super admin (has all permissions set to true at root level)
  if (permissions["superAdmin"] === true) {
    return true;
  }
  
  // Check specific permission
  const permissionValue = permissions[permission];
  
  if (typeof permissionValue === "boolean") {
    return permissionValue;
  }
  
  if (typeof permissionValue === "object" && permissionValue !== null && action) {
    return (permissionValue as Record<string, boolean>)[action] === true;
  }
  
  return false;
}

/**
 * Get user's full profile with relations
 */
export async function getUserProfile(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      vendor: true,
      customer: true,
      adminProfile: true,
      addresses: {
        orderBy: { isDefaultShipping: "desc" },
      },
    },
  });
}

/**
 * Get vendor profile for current user
 */
export async function getCurrentVendor() {
  const user = await requireVendor();
  
  const vendor = await db.vendor.findUnique({
    where: { userId: user.id },
    include: {
      user: true,
      documents: true,
    },
  });
  
  if (!vendor) {
    redirect("/vendor/onboarding");
  }
  
  return vendor;
}

/**
 * Get customer profile for current user
 */
export async function getCurrentCustomer() {
  const user = await requireAuth();
  
  const customer = await db.customer.findUnique({
    where: { userId: user.id },
    include: {
      user: {
        include: {
          addresses: true,
        },
      },
      wishlist: {
        include: {
          vendorProduct: {
            include: {
              product: true,
              vendor: true,
            },
          },
        },
      },
    },
  });
  
  return customer;
}

/**
 * Verify email token and activate user
 */
export async function verifyEmailToken(token: string) {
  const user = await db.user.findFirst({
    where: { emailVerificationToken: token },
  });
  
  if (!user) {
    return { success: false, error: "Invalid or expired token" };
  }
  
  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
    },
  });
  
  return { success: true, user };
}

/**
 * Verify password reset token
 */
export async function verifyPasswordResetToken(token: string) {
  const user = await db.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpiry: {
        gt: new Date(),
      },
    },
  });
  
  if (!user) {
    return { valid: false, user: null };
  }
  
  return { valid: true, user };
}

/**
 * Log an admin action to audit log
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  details: {
    entityType?: string;
    entityId?: string;
    beforeData?: unknown;
    afterData?: unknown;
    ip?: string;
    userAgent?: string;
  }
) {
  const admin = await db.user.findUnique({
    where: { id: adminId },
    select: { email: true, role: true },
  });
  
  await db.auditLog.create({
    data: {
      adminId,
      adminEmail: admin?.email,
      role: admin?.role,
      action,
      entityType: details.entityType,
      entityId: details.entityId,
      beforeData: details.beforeData ? JSON.parse(JSON.stringify(details.beforeData)) : undefined,
      afterData: details.afterData ? JSON.parse(JSON.stringify(details.afterData)) : undefined,
      ip: details.ip,
      userAgent: details.userAgent,
    },
  });
}
