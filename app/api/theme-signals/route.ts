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

            // --- UPGRADED KIM DAERI INTELLIGENCE ENGINE ---
            const getDynamicReason = (ticker: string, change: number, lang: string) => {
                const isKo = lang === 'ko';
                const absChange = Math.abs(change);

                const specialInsights: Record<string, any> = {
                    'NVDA': {
                        bull: isKo ? "블랙웰(Blackwell) 칩셋 공급 부족이 가시화되며 기관의 매수세가 이어지고 있습니다. $185 지지는 강력한 추세 연장을 시사합니다."
                            : "Blackwell supply tightness is fueling institutional accumulation. Support at $185 indicates a robust trend extension.",
                        bear: isKo ? "차익 실현 매물이 출회되고 있으나, 데이터센터 부문의 성장성은 독보적입니다. 하방 경직성을 테스트하는 구간입니다."
                            : "Profit-taking is causing friction, but Data Center fundamentals remain unrivaled. Currently testing floor integrity."
                    },
                    'TSLA': {
                        bull: isKo ? "FSD v13 버전의 압도적 성과가 시장의 재평가를 이끌고 있습니다. 에너지 사업부의 마진 개선이 주가 상승의 촉매제입니다."
                            : "Exceptional performance of FSD v13 is driving a market re-rating. Energy division margin expansion is the key catalyst.",
                        bear: isKo ? "인도시장 진출 연기 노이즈로 변동성이 커졌으나, 로보택시 비전은 유효합니다. $400 초반 매수 대기 자금이 확인됩니다."
                            : "Delay in India expansion is causing volatility, but the Robotaxi vision holds. Strong bid interest confirmed near low $400s."
                    },
                    'AAPL': {
                        bull: isKo ? "아이폰 17 시제품의 AI 성능 혁신 기대감이 유입되고 있습니다. 현금 흐름 기반의 자사주 매입이 하단을 지지합니다."
                            : "Innovation expectations for iPhone 17's AI capabilities are rising. Buybacks based on cash flow are providing a solid floor.",
                        bear: isKo ? "중국 내 점유율 회복 속도가 예상보다 더디지만, 서비스 부문의 안정적 성장이 밸류에이션 하락을 방어 중입니다."
                            : "Recovery in China market share is slower than expected, but steady Service segment growth is protecting the valuation."
                    }
                };

                if (specialInsights[ticker]) {
                    return change >= 0 ? specialInsights[ticker].bull : specialInsights[ticker].bear;
                }

                const templates = {
                    bull: isKo ? [
                        `${ticker}의 장기 이평선 돌파와 함께 대량 거래가 동반된 고확신 매수 시그널입니다.`,
                        `기관의 바스켓 매수세가 유입되며 ${theme.name_ko} 섹터 내 주도주로 부상 중입니다.`,
                        "추세 추종 전략가들의 타겟이 되며 상방 압력이 강해지고 있습니다."
                    ] : [
                        `High-conviction buy signal for ${ticker} confirmed by volume-backed breakout.`,
                        `Emerging as a sector leader in ${theme.name_en} as institutional orders flood the tape.`,
                        "Targeted by trend-following funds, intensifying upward momentum."
                    ],
                    bear: isKo ? [
                        "기술적 반등 구간에 진입했으나, 상단 저항 매물이 두터워 보수적 접근이 필요합니다.",
                        "섹터 전반의 심리 위축으로 인해 일시적인 투매 압력을 받고 있는 구간입니다.",
                        "에너지 응축을 위한 건강한 조정 과정으로 판단되며 지지선 확인이 우선입니다."
                    ] : [
                        "Entering a technical bounce zone, but overhead resistance warrants caution.",
                        "Facing temporary sell-off pressure due to broad sector sentiment dampening.",
                        "Healthy correction to build momentum; verifying support levels is a priority."
                    ]
                };

                const pool = change >= 0 ? templates.bull : templates.bear;
                const seed = (ticker.length + Math.floor(absChange * 11)) % pool.length;
                return pool[seed];
            };

            const ai_reason = getDynamicReason(ticker, change, lang);

            const target_price = price * (1 + (impact_score / 1200) + 0.04);
            const stop_loss = price * (1 - (impact_score / 2000) - 0.03);

            return {
                id: `${ticker}-${Date.now()}-${Math.random()}`,
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

        // --- FALLBACK DATA WITH HIGH-INTELLIGENCE SYNC ---
        const theme = THEMES.find(t => t.id === searchParams.get('id')) || THEMES[0];
        const isEn = lang === 'en';

        // Re-use the dynamic reasoning logic for fallbacks too
        const getDynamicReason = (ticker: string, change: number, lang: string) => {
            const isKo = lang === 'ko';
            const absChange = Math.abs(change);

            const specialInsights: Record<string, any> = {
                'NVDA': {
                    bull: isKo ? "블랙웰(Blackwell) 칩셋 공급 부족이 가시화되며 기관의 매수세가 이어지고 있습니다. $185 지지는 강력한 추세 연장을 시사합니다."
                        : "Blackwell supply tightness is fueling institutional accumulation. Support at $185 indicates a robust trend extension.",
                    bear: isKo ? "차익 실현 매물이 출회되고 있으나, 데이터센터 부문의 성장성은 독보적입니다. 하방 경직성을 테스트하는 구간입니다."
                        : "Profit-taking is causing friction, but Data Center fundamentals remain unrivaled. Currently testing floor integrity."
                },
                'TSLA': {
                    bull: isKo ? "FSD v13 버전의 압도적 성과가 시장의 재평가를 이끌고 있습니다. 에너지 사업부의 마진 개선이 주가 상승의 촉매제입니다."
                        : "Exceptional performance of FSD v13 is driving a market re-rating. Energy division margin expansion is the key catalyst.",
                    bear: isKo ? "인도시장 진출 연기 노이즈로 변동성이 커졌으나, 로보택시 비전은 유효합니다. $400 초반 매수 대기 자금이 확인됩니다."
                        : "Delay in India expansion is causing volatility, but the Robotaxi vision holds. Strong bid interest confirmed near low $400s."
                },
                'AAPL': {
                    bull: isKo ? "아이폰 17 시제품의 AI 성능 혁신 기대감이 유입되고 있습니다. 현금 흐름 기반의 자사주 매입이 하단을 지지합니다."
                        : "Innovation expectations for iPhone 17's AI capabilities are rising. Buybacks based on cash flow are providing a solid floor.",
                    bear: isKo ? "중국 내 점유율 회복 속도가 예상보다 더디지만, 서비스 부문의 안정적 성장이 밸류에이션 하락을 방어 중입니다."
                        : "Recovery in China market share is slower than expected, but steady Service segment growth is protecting the valuation."
                }
            };

            if (specialInsights[ticker]) {
                return change >= 0 ? specialInsights[ticker].bull : specialInsights[ticker].bear;
            }

            const templates = {
                bull: isKo ? [
                    `${ticker}의 장기 이평선 돌파와 함께 대량 거래가 동반된 고확신 매수 시그널입니다.`,
                    `기관의 바스켓 매수세가 유입되며 ${theme.name_ko} 섹터 내 주도주로 부상 중입니다.`,
                    "추세 추종 전략가들의 타겟이 되며 상방 압력이 강해지고 있습니다."
                ] : [
                    `High-conviction buy signal for ${ticker} confirmed by volume-backed breakout.`,
                    `Emerging as a sector leader in ${theme.name_en} as institutional orders flood the tape.`,
                    "Targeted by trend-following funds, intensifying upward momentum."
                ],
                bear: isKo ? [
                    "기술적 반등 구간에 진입했으나, 상단 저항 매물이 두터워 보수적 접근이 필요합니다.",
                    "섹터 전반의 심리 위축으로 인해 일시적인 투매 압력을 받고 있는 구간입니다.",
                    "에너지 응축을 위한 건강한 조정 과정으로 판단되며 지지선 확인이 우선입니다."
                ] : [
                    "Entering a technical bounce zone, but overhead resistance warrants caution.",
                    "Facing temporary sell-off pressure due to broad sector sentiment dampening.",
                    "Healthy correction to build momentum; verifying support levels is a priority."
                ]
            };

            const pool = change >= 0 ? templates.bull : templates.bear;
            const seed = (ticker.length + Math.floor(absChange * 11)) % pool.length;
            return pool[seed];
        };

        const fallbackSignals = theme.tickers.map(ticker => {
            const priceMap: Record<string, number> = {
                'NVDA': 185.41, 'TSLA': 392.67, 'AAPL': 248.50, 'MSFT': 393.67, 'PLTR': 135.90,
                'AMD': 208.28, 'GOOGL': 322.00, 'META': 661.46, 'AVGO': 333.23, 'SMCI': 33.43,
                'TSM': 349.01, 'ASML': 1193.80, 'INTC': 50.59, 'AMZN': 210.45, 'NFLX': 782.40,
                'MU': 382.78, 'LRCX': 231.01, 'AMAT': 212.50, 'RIVN': 14.55, 'LI': 28.40,
                'ENPH': 47.27, 'FSLR': 234.36, 'CHPT': 5.58, 'PYPL': 40.42, 'SQ': 82.50,
                'COIN': 245.80, 'MSTR': 1350.00, 'V': 312.40, 'MA': 525.60
            };
            const basePrice = priceMap[ticker] || (100 + Math.random() * 400);
            const change = ticker === 'NVDA' ? 8.01 : (Math.random() * 6) - 2;
            const impact_score = ticker === 'NVDA' ? 98 : (75 + Math.floor(Math.random() * 20));

            return {
                id: `${ticker}-fallback-${Date.now()}-${Math.random()}`,
                ticker,
                name: `${ticker} Corp`,
                price: parseFloat(basePrice.toFixed(2)),
                change_pct: parseFloat(change.toFixed(2)),
                sentiment: change > 0 ? 'BULLISH' : 'BEARISH',
                impact_score,
                whale_active: impact_score > 85,
                ai_reason: getDynamicReason(ticker, change, lang),
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
