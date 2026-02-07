import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/pricing(.*)',
    '/news(.*)',
    '/market(.*)',
    '/api/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    // 보호되지 않은 경로(Public)가 아니면 체크하지만, 
    // 일단 500 에러 방지를 위해 최소한의 로직만 남김
    if (!isPublicRoute(req)) {
        // 특정 경로 보호 로직을 아주 단순하게 유지
        const { userId } = await auth();
        if (!userId) {
            return (await auth()).redirectToSignIn();
        }
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
