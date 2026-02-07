import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/pricing(.*)',
    '/news(.*)',
    '/market(.*)',
    '/api/(.*)', // API는 일단 모두 열어줌 (내부에서 가드 처리)
]);

const isProtectedRoute = createRouteMatcher([
    '/portfolio(.*)',
    '/analysis(.*)',
    '/vvip-alpha(.*)',
    '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    // 1. 공개 경로는 무조건 즉시 통과
    if (isPublicRoute(req)) return;

    // 2. 보호된 경로일 때만 로그인 체크
    if (isProtectedRoute(req)) {
        await (await auth()).protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
