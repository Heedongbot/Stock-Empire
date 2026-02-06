import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }

        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${symbol}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Cache-Control': 'no-cache'
                }
            }
        );

        if (!response.ok) throw new Error('Failed to fetch from Yahoo');

        const data = await response.json();
        const quote = data.quoteResponse?.result?.[0];

        if (!quote) {
            return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
        }

        return NextResponse.json(quote);

    } catch (error) {
        console.error('Quote API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
