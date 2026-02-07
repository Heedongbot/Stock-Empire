import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protected routes (require login)
const isProtectedRoute = createRouteMatcher([
    '/portfolio(.*)',
    '/analysis(.*)',
    '/vvip-alpha(.*)',
    // '/news(.*)', // News is public but some content is locked
]);

export default clerkMiddleware(async (auth, req) => {
    // Restrict dashboard routes to signed-in users
    if (isProtectedRoute(req)) (await auth()).protect();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
