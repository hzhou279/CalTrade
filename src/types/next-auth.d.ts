import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id?: string;
      /** The user's name */
      name?: string | null;
      /** The user's email address */
      email?: string | null;
      /** The user's phone number */
      phone?: string | null;
      /** The user's image */
      image?: string | null;
      /** The user's role */
      role?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id */
    userId?: string;
    /** The provider used for authentication */
    provider?: string;
    /** The user's role */
    role?: string;
  }
} 