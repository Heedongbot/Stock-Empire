const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Vercel 빌드 시 정적 페이지 생성을 유연하게 처리
};

export default nextConfig;
