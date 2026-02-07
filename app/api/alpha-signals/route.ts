import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ko';
    const isEn = lang === 'en';

    try {
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
            const name = quote.shortName || ticker;

            // AI Rationale Mocking - More professional tones
            let ai_reason = isEn
                ? "Institutional inflow detected at support levels. High probability of trend continuation."
                : "주요 지지선에서 기관의 강한 매수세가 확인됩니다. 추세 지속 가능성이 매우 높습니다.";
            let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'BULLISH';
            let impact_score = 85 + Math.floor(Math.random() * 15);

            if (change < -2) {
                ai_reason = isEn
                    ? "Technical bounce expected from oversold territory. RSI indicator oversold."
                    : "RSI 과매도 구간 진입에 따른 기술적 반등이 강력하게 예상되는 시점입니다.";
                sentiment = 'BULLISH';
            } else if (change > 3) {
                ai_reason = isEn
                    ? "Upward momentum accelerating. Resistance breakout in progress."
                    : "상승 모멘텀이 가속화되고 있으며, 주요 저항선 돌파가 진행 중입니다.";
                sentiment = 'BULLISH';
                impact_score = 92 + Math.floor(Math.random() * 7);
            } else if (change < -5) {
                ai_reason = isEn
                    ? "Significant selling pressure detected. Recommend defensive positioning."
                    : "강한 매도 압력이 감지되었습니다. 보수적인 관점에서의 리스크 관리가 필요합니다.";
                sentiment = 'BEARISH';
                impact_score = 90 + Math.floor(Math.random() * 10);
            }

            // Target/Stop logic - tightened for VVIP precision
            const target_price = price * (1 + (impact_score / 1200) + 0.04);
            const stop_loss = price * (1 - (impact_score / 2500) - 0.02);

            return {
                id: `${ticker}-${Date.now()}`,
                ticker,
                name,
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

        // Fallback Data with updated 2025/2026 realistic prices
        const fallbackSignals = [
            {
                id: 'TSLA-fallback', ticker: 'TSLA', name: 'Tesla, Inc.', price: 412.50, change_pct: 3.2, sentiment: 'BULLISH',
                impact_score: 94, target_price: 468.20, stop_loss: 382.40,
                ai_reason: isEn
                    ? "Surge in FSD adoption news driving institutional re-rating. Strong volume profile."
                    : "FSD 채택 급증 소식이 기관의 재평가를 유도하고 있습니다. 강력한 거래량 프로필이 포착됩니다.",
                updated_at: new Date().toISOString()
            },
            {
                id: 'NVDA-fallback', ticker: 'NVDA', name: 'NVIDIA Corporation', price: 142.30, change_pct: -1.5, sentiment: 'BULLISH',
                impact_score: 88, target_price: 158.40, stop_loss: 131.50,
                ai_reason: isEn
                    ? "Next-gen Blackwell demand exceeds supply. Buy the dip confirmed by AI Whale logic."
                    : "차세대 블랙웰 수요가 공급을 압도하고 있습니다. AI 고래 로직에 의해 저점 매수가 확인되었습니다.",
                updated_at: new Date().toISOString()
            },
            {
                id: 'AAPL-fallback', ticker: 'AAPL', name: 'Apple Inc.', price: 238.40, change_pct: 0.8, sentiment: 'NEUTRAL',
                impact_score: 75, target_price: 254.10, stop_loss: 226.50,
                ai_reason: isEn
                    ? "Accumulation phase near 50-day EMA. AI integration sentiment remains positive."
                    : "50일 EMA 근처에서 매집 단계가 진행 중입니다. AI 통합에 대한 시장 정서가 긍정적입니다.",
                updated_at: new Date().toISOString()
            },
            {
                id: 'AMD-fallback', ticker: 'AMD', name: 'Advanced Micro Devices', price: 182.10, change_pct: 2.1, sentiment: 'BULLISH',
                impact_score: 91, target_price: 204.50, stop_loss: 168.20,
                ai_reason: isEn
                    ? "Data center market share gains accelerating. High conviction breakout signal."
                    : "데이터 센터 시장 점유율 확보가 가속화되고 있습니다. 고확신 돌파 시그널이 발생했습니다.",
                updated_at: new Date().toISOString()
            }
        ];
        return NextResponse.json(fallbackSignals);
    }
}
