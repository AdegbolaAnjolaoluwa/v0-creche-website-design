import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isParentRoute = createRouteMatcher(["/parent(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
  }

  const role = (sessionClaims?.metadata as any)?.role;

  if (isAdminRoute(req) && role !== "org:admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isStaffRoute(req) && role !== "org:staff" && role !== "org:admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isParentRoute(req) && role !== "org:parent" && role !== "org:admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/parent/:path*",
    "/api/:path*"
  ],
};
