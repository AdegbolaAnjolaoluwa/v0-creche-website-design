import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/login(.*)", 
  "/sign-up(.*)", 
  "/about", 
  "/contact", 
  "/programs", 
  "/privacy", 
  "/terms",
  "/api/webhooks(.*)"
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isParentRoute = createRouteMatcher(["/parent(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // If it's a public route, just let it pass
    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    const { userId, sessionClaims } = await auth();
    
    // If not signed in and trying to access protected route, Clerk handles redirect usually,
    // but let's be explicit if needed or let Clerk do its job.
    if (!userId) {
        return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
    }

    const role = (sessionClaims?.metadata as any)?.role;

    // Role-based Access Control
    if (isAdminRoute(req)) {
        if (role !== 'org:admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    if (isStaffRoute(req)) {
        if (role !== 'org:staff' && role !== 'org:admin') {
             return NextResponse.redirect(new URL('/', req.url));
        }
    }

    if (isParentRoute(req)) {
        if (role !== 'org:parent' && role !== 'org:admin') { // Admins might need to view parent stuff? Maybe not.
             return NextResponse.redirect(new URL('/', req.url));
        }
    }
    
    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
