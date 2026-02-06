import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'ko';
        const market = searchParams.get('market') || 'global'; // 'global' (US) or 'kr'

        // Determine file path based on market
        // For development/demo, we use the high-quality tiered data in public folder
        // In production, this should point to the live crawler output
        let fileName = 'us-news-tiered.json';
        if (market === 'kr') {
            fileName = 'kr_news_latest.json'; // Future placeholder
        }

        // Use process.cwd() to locate public folder correctly in Next.js
        const filePath = path.join(process.cwd(), 'public', fileName);

        if (!fs.existsSync(filePath)) {
            console.error('Data file not found:', filePath);
            return NextResponse.json({
                reports: [],
                error: "Data source not found"
            });
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        let data;
        try {
            data = JSON.parse(fileContents);
        } catch (e) {
            console.error("JSON Parse Error", e);
            data = [];
        }

        // Standardize output format for frontend
        // If data is array (like us-news-tiered.json), wrap it
        const reports = Array.isArray(data) ? data : (data.reports || []);

        return NextResponse.json({
            reports: reports,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to load news data' }, { status: 500 });
    }
}
