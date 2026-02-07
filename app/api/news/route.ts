
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'ALL';

    try {
        let allNews: any[] = [];

        // 뉴스 로드 함수 (데이터 폴더 또는 상위 폴더 지원)
        const getFilePath = (filename: string) => {
            const possiblePaths = [
                path.join(process.cwd(), 'data', filename),
                path.join(process.cwd(), '..', filename),
                path.join('c:\\Users\\66683\\OneDrive\\바탕 화면\\연구자동화', filename)
            ];
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) return p;
            }
            return null;
        };

        // 한국 뉴스 로드
        if (market === 'ALL' || market === 'KR') {
            const krDataPath = getFilePath('kr_news_latest.json');
            if (krDataPath) {
                const krContent = fs.readFileSync(krDataPath, 'utf-8');
                const krNews = JSON.parse(krContent);
                allNews = [...allNews, ...krNews];
            }
        }

        // 미국 뉴스 로드
        if (market === 'ALL' || market === 'US') {
            const usDataPath = getFilePath('us_news_latest.json');
            if (usDataPath) {
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
