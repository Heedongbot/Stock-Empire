import { clerkMiddleware } from "@clerk/nextjs/server";

// 미들웨어 로직을 완전히 비워서 500 에러 원인을 차단함
export default clerkMiddleware();

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
