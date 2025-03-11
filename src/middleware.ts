import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that don't require authentication
const publicPaths = [
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/api/auth/sms",
  "/", // Root path is now public (marketplace)
  "/marketplace", // Marketplace paths are public for browsing
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public or starts with /api/auth (NextAuth.js API routes)
  if (
    publicPaths.some((path) => pathname === path) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/marketplace/") && !pathname.includes("/new") && !pathname.includes("/my-items") && !pathname.includes("/edit") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to sign-in page if not authenticated
  if (!token) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Check for admin access
  if (pathname.startsWith("/admin")) {
    // If user is not an admin, redirect to sign-in page
    if (token.role !== "admin") {
      console.log("Access denied: User is not an admin", token);
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}; 