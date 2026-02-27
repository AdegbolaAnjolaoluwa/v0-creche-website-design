import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isParentRoute = createRouteMatcher(["/parent(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect Admin routes
  if (isAdminRoute(req)) {
      await auth.protect((has) => {
          return has({ role: 'org:admin' })
      })
  }

  // Protect Staff routes
  if (isStaffRoute(req)) {
      await auth.protect((has) => {
          return has({ role: 'org:staff' }) || has({ role: 'org:admin' })
      })
  }

  // Protect Parent routes
  if (isParentRoute(req)) {
       await auth.protect((has) => {
          return has({ role: 'org:parent' })
      })
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
