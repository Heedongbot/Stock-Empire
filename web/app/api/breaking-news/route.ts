import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'ko';

        // 속보 분석 파일 경로
        const filePath = path.join('c:\\Users\\66683\\OneDrive\\바탕 화면\\연구자동화', 'breaking_news_analyzed.json');

        // 파일이 없으면 빈 배열 반환
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({
                breaking_news: [],
                last_analyzed: null,
                total_count: 0
            });
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        return NextResponse.json({
            breaking_news: data.analyzed_news || [],
            last_analyzed: data.last_analyzed,
            total_count: data.total_count || 0,
            analyst: data.analyst || "정대리"
        });

    } catch (error) {
        console.error('Breaking News API Error:', error);

        // 폴백 데이터
        return NextResponse.json({
            breaking_news: [],
            last_analyzed: null,
            total_count: 0,
            error: 'Failed to load breaking news'
        });
    }
}
