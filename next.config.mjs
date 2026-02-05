/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    // eslint key is removed to avoid the "no longer supported" warning
};

export default nextConfig;
