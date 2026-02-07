/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    // 최신 Next.js에서는 eslint 무시 설정이 불필요하거나 형식이 다를 수 있음
};

export default nextConfig;
