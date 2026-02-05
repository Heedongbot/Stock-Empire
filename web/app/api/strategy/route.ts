
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const dataPath = path.join(process.cwd(), '../../current_strategy.md');

    try {
        if (fs.existsSync(dataPath)) {
            const content = fs.readFileSync(dataPath, 'utf-8');
            return NextResponse.json({ content });
        } else {
            return NextResponse.json({ content: "No strategy file found. System ready for input." });
        }
    } catch (e) {
        console.error("Strategy read error:", e);
        return NextResponse.json({ content: "Error accessing secure storage." }, { status: 500 });
    }
}
