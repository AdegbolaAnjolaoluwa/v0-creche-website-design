import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher([
  '/admin(.*)',
  '/staff(.*)',
  '/parent(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://img.clerk.com https://lh3.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://clerk.com https://*.clerk.com https://*.clerk.accounts.dev; frame-src 'self' https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self';");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (isProtected(req)) {
      const { userId, sessionClaims } = await auth();
      
      if (!userId) {
         return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
      }
      
      const role = (sessionClaims?.metadata as any)?.role;
      const path = req.nextUrl.pathname;

      if (path.startsWith("/admin") && role !== "org:admin") {
          return NextResponse.redirect(new URL("/", req.url));
      }
      if (path.startsWith("/staff") && role !== "org:staff" && role !== "org:admin") {
          return NextResponse.redirect(new URL("/", req.url));
      }
      if (path.startsWith("/parent") && role !== "org:parent" && role !== "org:admin") {
          // Allow parent login page or api to be accessed if needed, but here we protect /parent
          // Note: Our custom parent login is at /api/auth/parent-login and /login, which are public.
          // This protects the dashboard.
          return NextResponse.redirect(new URL("/", req.url));
      }
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
