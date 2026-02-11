import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/vvip-alpha/'], // 민감한 경로는 크롤링 제외
        },
        sitemap: 'https://stock-empire.vercel.app/sitemap.xml',
    };
}
