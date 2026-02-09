import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'all'; // all, kr, us

    try {
        const publicDir = path.join(process.cwd(), 'public');
        const usNewsPath = path.join(publicDir, 'us-news-realtime.json');

        // 해외(미국) 현지 뉴스 로드 (야후, 인베스팅, 마켓워치 통합본)
        if (fs.existsSync(usNewsPath)) {
            const usData = JSON.parse(fs.readFileSync(usNewsPath, 'utf-8'));
            // 최신순 정렬은 이미 크롤러에서 관리되거나 여기서 한번 더 수행
            return NextResponse.json(usData.slice(0, 30));
        }

        return NextResponse.json([]);

    } catch (error) {
        console.error('News API Integration Error:', error);
        return NextResponse.json({ error: 'Failed to fetch global news' }, { status: 500 });
    }
}
