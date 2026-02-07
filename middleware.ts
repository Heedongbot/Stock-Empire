import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/pricing',
    '/news(.*)',
    '/market(.*)',
    '/api/breaking-news', // 공개 API
    '/api/news', // 공개 API
]);

const isProtectedRoute = createRouteMatcher([
    '/portfolio(.*)',
    '/analysis(.*)',
    '/vvip-alpha(.*)',
    '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req) && !isPublicRoute(req)) {
        await (await auth()).protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
