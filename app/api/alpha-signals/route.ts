import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        // AlphaAnalyzer가 생성한 실제 데이터를 읽어옵니다.
        const dataPath = path.join(process.cwd(), 'public', 'alpha-signals.json');

        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, 'utf-8');
            return NextResponse.json(JSON.parse(rawData));
        }

        // 데이터 파일이 아직 없으면 빈 배열 반환
        return NextResponse.json([]);

    } catch (error) {
        console.error('Alpha Signals API Error:', error);
        return NextResponse.json({ error: 'Failed to load signals' }, { status: 500 });
    }
}
