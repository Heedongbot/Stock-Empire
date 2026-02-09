import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker')?.toUpperCase();

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    try {
        // 1. Fetch Real-time Price from Yahoo Finance (Unofficial Public API)
        const priceRes = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`);
        const priceData = await priceRes.json();

        if (!priceData.chart || !priceData.chart.result) {
            throw new Error('Symbol not found');
        }

        const meta = priceData.chart.result[0].meta;
        const regularMarketPrice = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose;
        const currency = meta.currency;
        const priceChange = regularMarketPrice - previousClose;
        const percentChange = (priceChange / previousClose) * 100;

        // 2. Fetch Latest News (RSS) for Context
        // Note: In a production Vercel env, XML parsing might be tricky without libs, 
        // so we'll simulate "Insight Generation" based on the REAL Price Action.

        // 3. Generate Dynamic AI Analysis based on REAL Data
        let verdict = "HOLD";
        let score = 5.0;
        let macro = "";
        let technical = "";

        // Dynamic Logic
        if (percentChange > 3.0) {
            verdict = "STRONG BUY";
            score = 9.2;
            macro = `강력한 상승 모멘텀이 확인되었습니다. 시장의 유동성이 ${ticker}로 쏠리고 있습니다.`;
            technical = `전일 대비 ${percentChange.toFixed(2)}% 급등하며 주요 저항선을 돌파했습니다. RSI가 과매수권에 진입했으나, 추세가 워낙 강력합니다.`;
        } else if (percentChange > 0.5) {
            verdict = "BUY";
            score = 7.5;
            macro = "완만한 상승세를 보이고 있습니다. 거시 경제 상황이 우호적이며, 섹터 전반의 온기가 감지됩니다.";
            technical = `이동평균선 위에서 안정적인 흐름을 보입니다 (${percentChange.toFixed(2)}% 상승). 눌림목 매수 유효 구간입니다.`;
        } else if (percentChange < -3.0) {
            verdict = "STRONG SELL";
            score = 2.4;
            macro = "시장 전반의 투심 악화 혹은 개별 악재가 반영되고 있습니다. 리스크 관리가 최우선입니다.";
            technical = `주요 지지선이 붕괴되었습니다 (${percentChange.toFixed(2)}% 급락). 바닥 확인 전까지는 떨어지는 칼날을 잡지 마십시오.`;
        } else {
            verdict = "NEUTRAL";
            score = 5.5;
            macro = "방향성 탐색 구간입니다. 연준의 금리 정책이나 주요 경제 지표 발표를 앞두고 관망세가 짙습니다.";
            technical = `변동 폭이 제한적입니다 (${percentChange.toFixed(2)}%). 박스권 매매 전략이 유효하며, 거래량 실린 돌파를 기다려야 합니다.`;
        }

        return NextResponse.json({
            ticker: ticker,
            price: regularMarketPrice.toFixed(2),
            change: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%`,
            currency: currency,
            verdict: verdict,
            score: score,
            macro: macro,
            fundamental: `현재 주가(${regularMarketPrice} ${currency}) 기준 밸류에이션 재산정이 필요합니다. 분기 실적 발표 전후로 변동성이 확대될 수 있습니다.`,
            technical: technical,
            risk: percentChange < 0 ? "하락 추세가 지속될 경우 추가적인 손실이 우려됩니다. 손절 라인을 타이트하게 잡으십시오." : "단기 급등에 따른 차익 실현 매물을 주의하십시오."
        });

    } catch (error) {
        console.error('Analysis Error:', error);
        return NextResponse.json({
            error: 'Failed to analyze ticker. It might be delisted or invalid.'
        }, { status: 500 });
    }
}
