
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    // 데이터 파일 경로 서칭
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

    const dataPath = getFilePath('latest_master_analysis.json');

    try {
        if (dataPath && fs.existsSync(dataPath)) {
            const fileContent = fs.readFileSync(dataPath, 'utf-8');
            const data = JSON.parse(fileContent);
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ insights: [] });
        }
    } catch (e) {
        console.error("Master analysis read error:", e);
        return NextResponse.json({ error: "Failed to read insights" }, { status: 500 });
    }
}
