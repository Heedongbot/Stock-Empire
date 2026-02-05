import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        // Yahoo Finance API 호출
        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Yahoo Finance');
        }

        const data = await response.json();

        if (data.chart?.result?.[0]?.meta) {
            const meta = data.chart.result[0].meta;
            const price = meta.regularMarketPrice || 0;
            const prevClose = meta.chartPreviousClose || price;
            const change = price - prevClose;
            const changePercent = prevClose > 0 ? ((change / prevClose) * 100) : 0;

            return NextResponse.json({
                symbol,
                price: Math.round(price * 100) / 100,
                change: Math.round(change * 100) / 100,
                changePercent: Math.round(changePercent * 100) / 100,
                source: 'YAHOO_FINANCE'
            });
        }

        // Fallback: 시뮬레이션 데이터
        const basePrice = symbol === '^IXIC' ? 15000 : symbol === '^GSPC' ? 4500 : 2500;
        const randomChange = (Math.random() - 0.5) * 100;
        const price = basePrice + randomChange;
        const change = randomChange;
        const changePercent = (change / basePrice) * 100;

        return NextResponse.json({
            symbol,
            price: Math.round(price * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            source: 'SIMULATION'
        });

    } catch (error) {
        console.error('Market index API error:', error);

        // Fallback: 시뮬레이션 데이터
        const basePrice = symbol === '^IXIC' ? 15000 : symbol === '^GSPC' ? 4500 : 2500;
        const randomChange = (Math.random() - 0.5) * 100;
        const price = basePrice + randomChange;
        const change = randomChange;
        const changePercent = (change / basePrice) * 100;

        return NextResponse.json({
            symbol,
            price: Math.round(price * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            source: 'SIMULATION_FALLBACK'
        });
    }
}
