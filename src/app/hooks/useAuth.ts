"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  // Sign out and redirect to sign-in page
  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  // Redirect to sign-in page
  const login = () => {
    router.push("/auth/signin");
  };

  // Redirect to protected page if not authenticated
  const requireAuth = (callback?: () => void) => {
    if (status === "loading") return;
    
    if (!isAuthenticated) {
      router.push("/auth/signin");
    } else if (callback) {
      callback();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth,
  };
} 