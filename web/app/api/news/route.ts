
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'ALL';

    try {
        let allNews: any[] = [];

        // 한국 뉴스 로드
        if (market === 'ALL' || market === 'KR') {
            const krDataPath = path.join(process.cwd(), '../../global_news_feed.json');
            if (fs.existsSync(krDataPath)) {
                const krContent = fs.readFileSync(krDataPath, 'utf-8');
                const krNews = JSON.parse(krContent).filter((item: any) => item.market === 'KR');
                allNews = [...allNews, ...krNews];
            }
        }

        // 미국 뉴스 로드
        if (market === 'ALL' || market === 'US') {
            const usDataPath = path.join(process.cwd(), 'public/us-news.json');
            if (fs.existsSync(usDataPath)) {
                const usContent = fs.readFileSync(usDataPath, 'utf-8');
                const usNews = JSON.parse(usContent);
                allNews = [...allNews, ...usNews];
            }
        }

        // 최신 뉴스 60개 전달
        return NextResponse.json(allNews.slice(0, 60));
    } catch (e) {
        console.error("News feed read error:", e);
        return NextResponse.json({ error: "Failed to read news feed" }, { status: 500 });
    }
}
