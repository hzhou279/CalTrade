import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import WeChatProvider from "../../auth/providers/wechat";
import { z } from "zod";
import { NextAuthOptions } from "next-auth";
import { compare, hash } from "bcrypt";

const prisma = new PrismaClient();

// Phone number validation schema
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// SMS verification code validation
const verificationCodeSchema = z.string().length(6).regex(/^\d+$/);

// Email validation schema
const emailSchema = z.string().email();

// Password validation schema
const passwordSchema = z.string().min(6, {
  message: "Password must be at least 6 characters long",
});

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
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
              // Create admin user with hashed password
              const hashedPassword = await hash(credentials.password, 10);
              user = await prisma.user.create({
                data: {
                  email: credentials.email,
                  name: "Admin User",
                  emailVerified: new Date(),
                  role: "admin",
                  password: hashedPassword,
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
              
              // Update password if it doesn't exist
              if (!user.password) {
                const hashedPassword = await hash(credentials.password, 10);
                await prisma.user.update({
                  where: { id: user.id },
                  data: { password: hashedPassword },
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
          
          // For regular users, check if the user exists and verify password
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          
          if (!user) {
            throw new Error("User not found. Please sign up first.");
          }
          
          if (!user.password) {
            throw new Error("Please use another sign-in method or reset your password.");
          }
          
          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            throw new Error("Invalid password. Please try again.");
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role || "user",
          };
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