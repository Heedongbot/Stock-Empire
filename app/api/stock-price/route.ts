
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tickers = searchParams.get('tickers');

    if (!tickers) {
        return NextResponse.json({ error: 'No tickers provided' }, { status: 400 });
    }

    try {
        // Yahoo Finance v7 API (Quote)
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers}`;

        // Next.js caching: revalidate every 60 seconds to avoid API limits
        const res = await fetch(url, { next: { revalidate: 60 } });

        if (!res.ok) {
            throw new Error(`Yahoo API responded with ${res.status}`);
        }

        const data = await res.json();
        const result: Record<string, { price: number; change: number }> = {};

        if (data.quoteResponse && data.quoteResponse.result) {
            data.quoteResponse.result.forEach((stock: any) => {
                result[stock.symbol] = {
                    price: stock.regularMarketPrice,
                    change: stock.regularMarketChangePercent
                };
            });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Yahoo Finance Quote API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}
