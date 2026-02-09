import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({
            error: 'Google Gemini API 키가 설정되지 않았습니다. Vercel 환경 변수(GEMINI_API_KEY)를 확인해주세요.',
            code: 'MISSING_API_KEY'
        }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker')?.toUpperCase();

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    try {
        // 1. Fetch live price from Yahoo Finance
        const priceUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
        const priceRes = await fetch(priceUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!priceRes.ok) {
            throw new Error(`Yahoo Finance API error: ${priceRes.status}`);
        }

        const priceData = await priceRes.json();

        let currentPrice = 0;
        let changePct = 0;
        let companyName = ticker;

        if (priceData.quoteResponse?.result?.[0]) {
            const stock = priceData.quoteResponse.result[0];
            currentPrice = stock.regularMarketPrice;
            changePct = stock.regularMarketChangePercent;
            companyName = stock.shortName || stock.longName || ticker;
        } else {
            return NextResponse.json({ error: 'Invalid ticker or market data unavailable' }, { status: 404 });
        }

        // 2. Load context
        let newsContext = "";
        try {
            const newsPath = path.join(process.cwd(), 'public', 'us-news-realtime.json');
            if (fs.existsSync(newsPath)) {
                const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
                const relatedNews = newsData
                    .filter((n: any) => n.free_tier?.title?.includes(ticker) || n.free_tier?.summary?.includes(ticker))
                    .slice(0, 3);

                if (relatedNews.length > 0) {
                    newsContext = relatedNews.map((n: any) => `- ${n.free_tier.title}: ${n.free_tier.summary_kr || n.free_tier.summary}`).join('\n');
                }
            }
        } catch (e) {
            console.error("Context load error:", e);
        }

        // 3. Prompt Gemini for professional analysis
        const prompt = `
당신은 최고의 퀀트 트레이더이자 주식 분석 전문가 '코다리'입니다. 
다음 종목에 대해 실시간 데이터를 바탕으로 심층 분석을 수행하고, 투자 전략을 제시하세요. 

종목: ${companyName} (${ticker})
현재가: $${currentPrice} (${changePct.toFixed(2)}%)
최근 관련 뉴스:
${newsContext || "뉴스 정보 없음"}

다음 형식의 JSON으로만 응답하세요:
{
  "ticker": "${ticker}",
  "name": "${companyName}",
  "strategy": "전략 명칭 (예: 낙폭 과대 반등, 강력 추세 등)",
  "price": ${currentPrice},
  "change_pct": ${changePct},
  "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL",
  "impact_score": 0~100 사이 숫자,
  "target_price": 목표가 (숫자),
  "stop_loss": 손절가 (숫자),
  "ai_reason": "전체적인 분석 요약 (한 문장)",
  "technical_analysis": "기술적 지표 및 가격 흐름 분석",
  "fundamental_analysis": "모멘텀 및 재료 분석",
  "action_plan": "구체적인 대응 계획 (익절/손절 가이드 포함)"
}

언어: 한국어
`;

        const resultResponse = await model.generateContent(prompt);
        const responseText = resultResponse.response.text();
        const result = JSON.parse(responseText || '{}');

        result.id = `${ticker}-${Date.now()}`;
        result.updated_at = new Date().toISOString();
        result.is_real_time = true;

        return NextResponse.json(result);

    } catch (error) {
        console.error('Ticker Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze ticker' }, { status: 500 });
    }
}
