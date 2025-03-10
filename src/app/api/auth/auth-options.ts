import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import WeChatProvider from "../../auth/providers/wechat";
import { z } from "zod";
import { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

// Phone number validation schema
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// SMS verification code validation
const verificationCodeSchema = z.string().length(6).regex(/^\d+$/);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // WeChat OAuth provider
    WeChatProvider({
      clientId: process.env.WECHAT_CLIENT_ID as string,
      clientSecret: process.env.WECHAT_CLIENT_SECRET as string,
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
          return null;
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
          
          return null;
        } catch (error) {
          console.error("Phone authentication error:", error);
          return null;
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
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.userId) {
        session.user.id = token.userId as string;
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