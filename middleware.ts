import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/pricing',
    '/news(.*)',
    '/market(.*)',
]);

const isProtectedRoute = createRouteMatcher([
    '/portfolio(.*)',
    '/analysis(.*)',
    '/vvip-alpha(.*)',
    '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req) && !isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
