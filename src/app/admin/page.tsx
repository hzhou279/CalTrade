"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard when this page loads
    router.replace("/admin/dashboard");
  }, [router]);

  // Return a simple loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-lg font-medium text-gray-900">Redirecting to dashboard...</h2>
      </div>
    </div>
  );
} 