
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const dataPath = path.join(process.cwd(), '../../latest_master_analysis.json');

    try {
        if (fs.existsSync(dataPath)) {
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
