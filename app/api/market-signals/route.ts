import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // [TARGET SYMBOLS]
        // KRW=X : USD/KRW Exchange Rate
        // ^TNX  : US 10-Year Treasury Yield
        // CL=F  : Crude Oil (WTI)
        // GC=F  : Gold Futures
        // ^IXIC : Nasdaq for correlation check

        const symbols = ['KRW=X', '^TNX', 'CL=F', 'GC=F'];
        // Using querystring to fetch multiple symbols at once from Yahoo Finance (undocumented but works)
        const querySymbols = symbols.join(',');

        const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${querySymbols}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Cache-Control': 'no-cache'
                }
            }
        );

        if (!response.ok) throw new Error('Failed to fetch from Yahoo');

        const data = await response.json();
        const quotes = data.quoteResponse?.result || [];

        // Transform Yahoo Data to Our Signal Format
        const signals = quotes.map((quote: any) => {
            let id = '';
            let name = '';
            let threshold = '';
            let status = 'SAFE';
            let probability = 50;
            let direction = 'NEUTRAL';
            let description = '';

            // 1. USD/KRW Exchange Rate
            if (quote.symbol === 'KRW=X') {
                id = 'exchange-rate';
                name = 'USD/KRW 환율';
                const price = quote.regularMarketPrice;
                threshold = '1,350원';

                if (price >= 1400) {
                    status = 'CRITICAL';
                    probability = 88;
                    direction = 'DOWN'; // Market Crash Risk
                    description = `환율이 ${price.toFixed(2)}원으로 심각한 수준입니다. 외국인 자본 이탈 가능성이 매우 높습니다. 현금 비중을 늘리세요.`;
                } else if (price >= 1350) {
                    status = 'CAUTION';
                    probability = 72;
                    direction = 'DOWN';
                    description = `환율이 ${price.toFixed(2)}원으로 경계 구간입니다. 수출주 중심의 포트폴리오 재편이 필요합니다.`;
                } else {
                    status = 'SAFE';
                    probability = 60; // Safe usually means upside chance
                    direction = 'UP';
                    description = `환율이 ${price.toFixed(2)}원으로 안정적입니다. 외국인 수급이 개선될 수 있습니다.`;
                }
            }
            // 2. US 10Y Treasury Yield
            else if (quote.symbol === '^TNX') {
                id = 'us-yield';
                name = '미국 10년물 국채 금리';
                const price = quote.regularMarketPrice;
                threshold = '4.5%';

                if (price >= 4.5) {
                    status = 'CRITICAL';
                    probability = 85;
                    direction = 'DOWN'; // Tech stock crash risk
                    description = `국채 금리가 ${price.toFixed(2)}%로 치솟았습니다. 고PER 기술주(성장주)에 치명적일 수 있습니다.`;
                } else if (price >= 4.0) {
                    status = 'CAUTION';
                    probability = 65;
                    direction = 'DOWN';
                    description = `금리가 ${price.toFixed(2)}%로 높은 편입니다. 주식 시장의 밸류에이션 부담이 있습니다.`;
                } else {
                    status = 'SAFE';
                    probability = 70;
                    direction = 'UP';
                    description = `금리가 ${price.toFixed(2)}%로 하향 안정화되고 있습니다. 성장주 랠리에 유리한 환경입니다.`;
                }
            }
            // 3. Crude Oil (WTI)
            else if (quote.symbol === 'CL=F') {
                id = 'oil-price';
                name = 'WTI 원유(유가)';
                const price = quote.regularMarketPrice;
                threshold = '$90';

                if (price >= 90) {
                    status = 'CRITICAL';
                    probability = 80;
                    direction = 'DOWN'; // Inflation risk
                    description = `유가가 $${price.toFixed(2)}로 인플레이션 공포를 자극하고 있습니다. 소비 위축이 우려됩니다.`;
                } else if (price >= 80) {
                    status = 'CAUTION';
                    probability = 55;
                    direction = 'NEUTRAL';
                    description = `유가가 $${price.toFixed(2)}로 다소 높습니다. 에너지 관련주에 주목할 시점입니다.`;
                } else {
                    status = 'SAFE';
                    probability = 65;
                    direction = 'UP'; // Good for economy
                    description = `유가가 $${price.toFixed(2)}로 안정적입니다. 물가 안정에 기여하며 증시에 긍정적입니다.`;
                }
            }
            // 4. Gold (Safe Haven)
            else if (quote.symbol === 'GC=F') {
                id = 'gold';
                name = '국제 금 시세';
                const price = quote.regularMarketPrice;
                threshold = '$2,400';

                if (price >= 2400) {
                    status = 'CAUTION';
                    probability = 60;
                    direction = 'DOWN'; // Fear index rising
                    description = `금값이 $${price.toLocaleString()}로 사상 최고치에 근접했습니다. 시장의 공포 심리가 반영되고 있습니다.`;
                } else {
                    status = 'SAFE';
                    probability = 50;
                    direction = 'NEUTRAL';
                    description = `금값이 $${price.toLocaleString()}입니다. 안전 자산 선호 심리가 평이합니다.`;
                }
            }

            return {
                id,
                name,
                value: quote.symbol === '^TNX' ? `${quote.regularMarketPrice}%` :
                    quote.symbol === 'KRW=X' ? `${quote.regularMarketPrice.toFixed(2)}원` :
                        `$${quote.regularMarketPrice.toFixed(2)}`,
                rawValue: quote.regularMarketPrice,
                threshold,
                status,
                probability,
                direction,
                description,
                change: quote.regularMarketChangePercent
            };
        });

        return NextResponse.json({
            signals,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Signal API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
    }
}
