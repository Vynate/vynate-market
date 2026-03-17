import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { Role, VendorStatus } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: Role;
      vendorStatus?: VendorStatus | null;
      vendorId?: string | null;
      adminPermissions?: Record<string, unknown> | null;
    };
  }

  interface User {
    role: Role;
    vendorStatus?: VendorStatus | null;
    vendorId?: string | null;
    adminPermissions?: Record<string, unknown> | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    vendorStatus?: VendorStatus | null;
    vendorId?: string | null;
    adminPermissions?: Record<string, unknown> | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // refresh token every 24h
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            vendor: true,
            adminProfile: true,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account locked. Please try again later.");
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error("Account is deactivated. Please contact support.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordValid) {
          // Increment login attempts
          const newAttempts = user.loginAttempts + 1;
          const updateData: { loginAttempts: number; lockedUntil?: Date } = {
            loginAttempts: newAttempts,
          };

          // Lock account after 5 failed attempts for 30 minutes
          if (newAttempts >= 5) {
            updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
          }

          await db.user.update({
            where: { id: user.id },
            data: updateData,
          });

          throw new Error("Invalid credentials");
        }

        // Reset login attempts on successful login
        await db.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
          vendorStatus: user.vendor?.status ?? null,
          vendorId: user.vendor?.id ?? null,
          adminPermissions: user.adminProfile?.permissions as Record<string, unknown> | null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.vendorStatus = user.vendorStatus;
        token.vendorId = user.vendorId;
        token.adminPermissions = user.adminPermissions;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.name = session.name;
        token.picture = session.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.vendorStatus = token.vendorStatus as VendorStatus | null | undefined;
        session.user.vendorId = token.vendorId as string | null | undefined;
        session.user.adminPermissions = token.adminPermissions as Record<string, unknown> | null | undefined;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth, check if user exists and create customer profile if needed
      if (account?.provider !== "credentials") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
          include: { customer: true },
        });

        if (existingUser && !existingUser.customer && existingUser.role === "CUSTOMER") {
          await db.customer.create({
            data: {
              userId: existingUser.id,
            },
          });
        }
      }

      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Create customer profile for new users
      if (user.id) {
        await db.customer.create({
          data: {
            userId: user.id,
          },
        });

        // Generate referral code
        const referralCode = `REF${user.id.slice(-8).toUpperCase()}`;
        await db.user.update({
          where: { id: user.id },
          data: { referralCode },
        });
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
});
