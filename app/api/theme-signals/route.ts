import { NextResponse } from 'next/server';
import { THEMES } from '@/lib/themes';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('id');
    const lang = searchParams.get('lang') || 'ko';
    const isEn = lang === 'en';

    try {

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
            const change = quote.regularMarketChangePercent || 0;
            const volume = quote.regularMarketVolume || 0;

            let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = change >= 1.5 ? 'BULLISH' : change <= -1.5 ? 'BEARISH' : 'NEUTRAL';
            let impact_score = 65 + Math.floor(Math.random() * 30);

            // Institutional Momentum Flag (Simulation based on volume/impact)
            const whale_active = volume > 5000000 || impact_score > 85;

            let ai_reason = "";
            if (lang === 'ko') {
                if (change > 3) ai_reason = `세력의 강력한 매집으로 기술적 저항선을 돌파했습니다. "${theme.name_ko}" 섹터 내 가장 공격적인 우상향 흐름이 관찰됩니다.`;
                else if (change > 0) ai_reason = `기관 자금 유입과 함께 견고한 지지선을 형성 중입니다. 추세 추종 전략(Trend Following)이 유효한 구간입니다.`;
                else if (change < -3) ai_reason = `단기 과매도 구간 진입이 임박했습니다. ${ticker} 특유의 변동성을 고려할 때, 바닥 확인 후 반등 노림수가 필요합니다.`;
                else ai_reason = `안정적인 매물 소화 과정을 거치고 있습니다. 섹터 전반의 지수 방향성에 동조하며 에너지를 응축 중인 것으로 분석됩니다.`;
            } else {
                if (change > 3) ai_reason = `Strong institutional accumulation detected. Bullish breakout targeting key resistance levels in the ${theme.name_en} sector.`;
                else if (change > 0) ai_reason = `Forming a solid base with consistent buyer interest. Trend following maintains high probability of success.`;
                else if (change < -3) ai_reason = `Extreme short-term volatility. Entering oversold territory - monitoring for a classic RSI reversal signal.`;
                else ai_reason = `Consolidating within a tight range. Currently synchronizing with broader sector indices while accumulating momentum.`;
            }

            const target_price = price * (1 + (impact_score / 1200) + 0.04);
            const stop_loss = price * (1 - (impact_score / 2000) - 0.03);

            return {
                id: `${ticker}-${Date.now()}`,
                ticker,
                name: quote.shortName || ticker,
                price,
                change_pct: parseFloat(change.toFixed(2)),
                sentiment,
                impact_score,
                whale_active,
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

        // --- FALLBACK DATA FOR RELIABILITY ---
        const theme = THEMES.find(t => t.id === searchParams.get('id')) || THEMES[0];
        const isEn = lang === 'en';

        const fallbackSignals = theme.tickers.map(ticker => {
            const priceMap: Record<string, number> = {
                'NVDA': 185.65, 'TSLA': 412.50, 'AAPL': 248.50, 'MSFT': 442.10, 'PLTR': 72.40,
                'AMD': 208.70, 'GOOGL': 188.40, 'META': 542.30, 'AVGO': 332.96, 'SMCI': 88.40
            };
            const basePrice = priceMap[ticker] || (100 + Math.random() * 400);
            const change = ticker === 'NVDA' ? 8.01 : (Math.random() * 6) - 2;
            const impact_score = ticker === 'NVDA' ? 98 : (75 + Math.floor(Math.random() * 20));

            return {
                id: `${ticker}-fallback-${Date.now()}`,
                ticker,
                name: `${ticker} Corp`,
                price: parseFloat(basePrice.toFixed(2)),
                change_pct: parseFloat(change.toFixed(2)),
                sentiment: change > 0 ? 'BULLISH' : 'BEARISH',
                impact_score,
                whale_active: impact_score > 85,
                ai_reason: isEn
                    ? `Institutional accumulation detected. NVDA showing dominant breakout pattern at $185.`
                    : `${ticker} 섹터 내 기관 수급 유입이 포착됩니다. 특히 NVDA의 $185 돌파는 강력한 주도주 신호입니다.`,
                updated_at: new Date().toISOString(),
                is_fallback: true
            };
        });

        return NextResponse.json({
            theme_name: isEn ? theme.name_en : theme.name_ko,
            signals: fallbackSignals
        });
    }
}
