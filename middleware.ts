import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isParentRoute = createRouteMatcher(["/parent(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const session = await auth()
    // Cast to any because Clerk types might not reflect custom metadata immediately
    const role = (session.sessionClaims?.metadata as any)?.role

    if (session.userId) {
        console.log("Middleware check -> User ID:", session.userId, "| Role:", role, "| Claims:", JSON.stringify(session.sessionClaims));
    }

    // Redirect authenticated users away from auth pages
    const isAuthPage = req.nextUrl.pathname === '/sign-up' || req.nextUrl.pathname === '/login'
    if (isAuthPage && session.userId) {
        if (role === 'org:admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        if (role === 'org:staff') return NextResponse.redirect(new URL('/staff/dashboard', req.url))
        if (role === 'org:parent') return NextResponse.redirect(new URL('/parent/dashboard', req.url))
        // DO NOT FALLBACK blindly if role is missing/unknown.
        // This prevents loops where dashboard redirects back to login because role is missing.
        // Let them stay on login page to resolve their session or sign out.
    }

    // Protect Admin routes
    if (isAdminRoute(req)) {
        if (role !== 'org:admin') {
            // If not authenticated or not admin, redirect
            if (!session.userId) return NextResponse.redirect(new URL('/login', req.url))
            return NextResponse.redirect(new URL('/login?unauthorized=true', req.url))
        }
    }

    // Protect Staff routes
    if (isStaffRoute(req)) {
        if (role !== 'org:staff' && role !== 'org:admin') {
            if (!session.userId) return NextResponse.redirect(new URL('/login', req.url))
            return NextResponse.redirect(new URL('/login?unauthorized=true', req.url))
        }
    }

    // Protect Parent routes
    if (isParentRoute(req)) {
        if (role !== 'org:parent') {
            if (!session.userId) return NextResponse.redirect(new URL('/login', req.url))
            return NextResponse.redirect(new URL('/login?unauthorized=true', req.url))
        }
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
