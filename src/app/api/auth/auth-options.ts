import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import WeChatProvider from "../../auth/providers/wechat";
import { z } from "zod";
import { NextAuthOptions } from "next-auth";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

// Phone number validation schema
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// SMS verification code validation
const verificationCodeSchema = z.string().length(6).regex(/^\d+$/);

// Email validation schema
const emailSchema = z.string().email();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // WeChat OAuth provider
    WeChatProvider({
      clientId: process.env.WECHAT_CLIENT_ID as string,
      clientSecret: process.env.WECHAT_CLIENT_SECRET as string,
    }),
    // Email/Password credentials provider
    CredentialsProvider({
      id: "email-login",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@caltrade.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        try {
          // Validate email format
          emailSchema.parse(credentials.email);
          
          // For development/testing, we'll accept admin@caltrade.com with any password
          if (credentials.email === "admin@caltrade.com") {
            console.log(`[DEV MODE] Accepting admin login for ${credentials.email}`);
            
            // Find or create admin user
            let user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: credentials.email,
                  name: "Admin User",
                  emailVerified: new Date(),
                  role: "admin",
                },
              });
            } else {
              // Update role to admin if not already set
              if (user.role !== "admin") {
                await prisma.user.update({
                  where: { id: user.id },
                  data: { role: "admin" },
                });
              }
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              role: "admin",
            };
          }
          
          // For other users, implement proper password checking here
          // This is just a placeholder for future implementation
          throw new Error("Invalid credentials");
        } catch (error) {
          console.error("Email authentication error:", error);
          if (error instanceof z.ZodError) {
            throw new Error("Invalid email format");
          }
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed");
        }
      },
    }),
    // Phone number credentials provider
    CredentialsProvider({
      id: "phone-login",
      name: "Phone",
      credentials: {
        phone: { label: "Phone Number", type: "tel", placeholder: "+1234567890" },
        code: { label: "Verification Code", type: "text", placeholder: "123456" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          throw new Error("Phone number and verification code are required");
        }

        try {
          // Validate phone and code format
          const phone = phoneSchema.parse(credentials.phone);
          const code = verificationCodeSchema.parse(credentials.code);

          // In a production environment, we would:
          // 1. Check the verification code against Redis
          // 2. Delete the code after successful verification
          
          // For development/testing, we'll accept any valid code format
          if (process.env.NODE_ENV === "development") {
            console.log(`[DEV MODE] Accepting verification code for ${phone}: ${code}`);
            
            // Find or create user
            let user = await prisma.user.findUnique({
              where: { phone },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  phone,
                  phoneVerified: new Date(),
                },
              });
            } else if (!user.phoneVerified) {
              // Update phone verification status if not already verified
              await prisma.user.update({
                where: { id: user.id },
                data: { phoneVerified: new Date() },
              });
            }

            return {
              id: user.id,
              phone: user.phone,
              name: user.name,
              email: user.email,
            };
          }
          
          throw new Error("Invalid verification code");
        } catch (error) {
          console.error("Phone authentication error:", error);
          if (error instanceof z.ZodError) {
            throw new Error("Invalid phone number or verification code format");
          }
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          userId: user.id,
          provider: account.provider,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      if (token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
}; 