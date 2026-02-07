import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'all'; // all, kr, us

    try {
        const publicDir = path.join(process.cwd(), 'public');
        const krNewsPath = path.join(publicDir, 'kr-news-realtime.json');
        const usNewsPath = path.join(publicDir, 'us-news-realtime.json');

        let allNews: any[] = [];

        // 한국 뉴스 로드
        if ((market === 'all' || market === 'kr') && fs.existsSync(krNewsPath)) {
            const krData = JSON.parse(fs.readFileSync(krNewsPath, 'utf-8'));
            allNews = [...allNews, ...krData];
        }

        // 미국 뉴스 로드
        if ((market === 'all' || market === 'us') && fs.existsSync(usNewsPath)) {
            const usData = JSON.parse(fs.readFileSync(usNewsPath, 'utf-8'));
            allNews = [...allNews, ...usData];
        }

        // 시간순 정렬 (최신순)
        allNews.sort((a, b) => {
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });

        return NextResponse.json(allNews.slice(0, 30)); // 최신 30개만 반환

    } catch (error) {
        console.error('News API Integration Error:', error);
        return NextResponse.json({ error: 'Failed to fetch global news' }, { status: 500 });
    }
}
