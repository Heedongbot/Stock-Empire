import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'ko';
        const isEn = lang === 'en';

        const symbols = ['META', 'NVDA', 'AAPL', 'TSLA', 'AMD', 'MSFT', 'GOOGL', 'PLTR'];
        const querySymbols = symbols.join(',');

        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${querySymbols}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Cache-Control': 'no-cache'
                }
            }
        );

        if (!response.ok) throw new Error('Failed to fetch from Yahoo');

        const data = await response.json();
        const quotes = data.quoteResponse?.result || [];

        const signals = quotes.map((quote: any) => {
            const ticker = quote.symbol;
            const price = quote.regularMarketPrice;
            const change = quote.regularMarketChangePercent;

            // AI Rationale Mocking
            let ai_reason = isEn
                ? "Uptrend momentum is maintaining with institutional inflow."
                : "상승 추세가 유지되고 있으며 기관 매수세가 유입되고 있습니다.";
            let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'BULLISH';
            let impact_score = 85 + Math.floor(Math.random() * 15);

            if (change < -2) {
                ai_reason = isEn
                    ? "Technical rebound expected from short-term oversold zone."
                    : "단기 과매도 구간 진입으로 기술적 반등이 기대됩니다.";
                sentiment = 'BULLISH';
            } else if (change > 2) {
                ai_reason = isEn
                    ? "Attempt to break resistance levels is expected."
                    : "추세 상단 저항선 돌파 시도가 예상됩니다.";
                sentiment = 'BULLISH';
            } else if (change < -5) {
                ai_reason = isEn
                    ? "Further downside risk exists. Support level confirmation needed."
                    : "추가 하락 리스크가 존재하며 지지선 확인이 필요합니다.";
                sentiment = 'BEARISH';
                impact_score = 90 + Math.floor(Math.random() * 10);
            }

            // Target/Stop logic
            const target_price = price * (1 + (impact_score / 1000) + 0.05);
            const stop_loss = price * (1 - (impact_score / 2000) - 0.03);

            return {
                id: `${ticker}-${Date.now()}`,
                ticker,
                name: ticker,
                price,
                change_pct: parseFloat(change.toFixed(2)),
                sentiment,
                impact_score,
                target_price: parseFloat(target_price.toFixed(2)),
                stop_loss: parseFloat(stop_loss.toFixed(2)),
                ai_reason,
                updated_at: new Date().toISOString()
            };
        });

        return NextResponse.json(signals);

    } catch (error) {
        console.error('Alpha Signals API Error:', error);

        // Fallback Data if Yahoo API fails
        const fallbackSignals = [
            {
                id: 'TSLA-fallback', ticker: 'TSLA', name: 'TSLA', price: 245.80, change_pct: 3.2, sentiment: 'BULLISH',
                impact_score: 94, target_price: 280, stop_loss: 215,
                ai_reason: "Strong momentum relative to sector. Institutional buying detected.",
                updated_at: new Date().toISOString()
            },
            {
                id: 'NVDA-fallback', ticker: 'NVDA', name: 'NVDA', price: 135.20, change_pct: -1.5, sentiment: 'BULLISH',
                impact_score: 88, target_price: 155, stop_loss: 118,
                ai_reason: "Oversold RSI suggests a short-term rebound opportunity.",
                updated_at: new Date().toISOString()
            },
            {
                id: 'AAPL-fallback', ticker: 'AAPL', name: 'AAPL', price: 225.50, change_pct: 0.8, sentiment: 'NEUTRAL',
                impact_score: 75, target_price: 240, stop_loss: 210,
                ai_reason: "Consolidating near support levels. Monitor for breakout.",
                updated_at: new Date().toISOString()
            },
            {
                id: 'AMD-fallback', ticker: 'AMD', name: 'AMD', price: 160.50, change_pct: 2.1, sentiment: 'BULLISH',
                impact_score: 91, target_price: 180, stop_loss: 145,
                ai_reason: "Breaking though key resistance with high volume.",
                updated_at: new Date().toISOString()
            }
        ];
        return NextResponse.json(fallbackSignals);
    }
}
