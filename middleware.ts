import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isParentRoute = createRouteMatcher(["/parent(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth()
  // Cast to any because Clerk types might not reflect custom metadata immediately
  const role = (session.sessionClaims?.metadata as any)?.role
  
  // Protect Admin routes
  if (isAdminRoute(req)) {
      if (role !== 'org:admin') {
          // If not authenticated or not admin, redirect
          if (!session.userId) return NextResponse.redirect(new URL('/login', req.url))
          return NextResponse.redirect(new URL('/login', req.url))
      }
  }

  // Protect Staff routes
  if (isStaffRoute(req)) {
      if (role !== 'org:staff' && role !== 'org:admin') {
          if (!session.userId) return NextResponse.redirect(new URL('/login', req.url))
          return NextResponse.redirect(new URL('/login', req.url))
      }
  }

  // Protect Parent routes
  if (isParentRoute(req)) {
       if (role !== 'org:parent') {
          if (!session.userId) return NextResponse.redirect(new URL('/login', req.url))
          return NextResponse.redirect(new URL('/login', req.url))
      }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
