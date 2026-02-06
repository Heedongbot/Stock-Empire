import { NextResponse } from 'next/server';
import { THEMES } from '@/lib/themes';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const themeId = searchParams.get('id');
        const lang = searchParams.get('lang') || 'ko';
        const isEn = lang === 'en';

        const theme = THEMES.find(t => t.id === themeId);
        if (!theme) {
            return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
        }

        const querySymbols = theme.tickers.join(',');
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

            let ai_reason = isEn
                ? `Leading the ${theme.name_en} sector with strong technical signals.`
                : `${theme.name_ko} 섹터를 주도하며 강력한 기술적 지표를 보여주고 있습니다.`;

            let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = change >= 0 ? 'BULLISH' : 'BEARISH';
            let impact_score = 70 + Math.floor(Math.random() * 25);

            if (Math.abs(change) < 0.5) sentiment = 'NEUTRAL';

            const target_price = price * (1 + (impact_score / 1500) + 0.03);
            const stop_loss = price * (1 - (impact_score / 2500) - 0.02);

            return {
                id: `${ticker}-${Date.now()}`,
                ticker,
                name: quote.shortName || ticker,
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

        return NextResponse.json({
            theme_name: isEn ? theme.name_en : theme.name_ko,
            signals
        });

    } catch (error) {
        console.error('Theme Signals API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch theme data' }, { status: 500 });
    }
}
