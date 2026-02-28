import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isStaffRoute = createRouteMatcher(["/staff(.*)"]);
const isParentRoute = createRouteMatcher(["/parent(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const session = await auth()
    const role = (session.sessionClaims?.metadata as any)?.role

    // Redirect authenticated users away from auth pages
    const isAuthPage = req.nextUrl.pathname === '/sign-up' || req.nextUrl.pathname === '/login'
    if (isAuthPage && session.userId) {
        if (role === 'org:admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        if (role === 'org:staff') return NextResponse.redirect(new URL('/staff/dashboard', req.url))
        if (role === 'org:parent') return NextResponse.redirect(new URL('/parent/dashboard', req.url))
    }

    // Protect Admin routes
    if (isAdminRoute(req)) {
        if (role !== 'org:admin') {
            const redirectUrl = new URL('/login', req.url)
            if (session.userId) {
                redirectUrl.searchParams.set('unauthorized', 'true')
            }
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Protect Staff routes
    if (isStaffRoute(req)) {
        if (role !== 'org:staff' && role !== 'org:admin') {
            const redirectUrl = new URL('/login', req.url)
            if (session.userId) {
                redirectUrl.searchParams.set('unauthorized', 'true')
            }
            return NextResponse.redirect(redirectUrl)
        }
    }

    // Protect Parent routes
    if (isParentRoute(req)) {
        if (role !== 'org:parent') {
            const redirectUrl = new URL('/login', req.url)
            if (session.userId) {
                redirectUrl.searchParams.set('unauthorized', 'true')
            }
            return NextResponse.redirect(redirectUrl)
        }
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
