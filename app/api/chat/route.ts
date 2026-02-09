import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Google Gemini API Key is missing in server environment. Please check GEMINI_API_KEY." },
            { status: 500 }
        );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const { message, masterId } = await req.json();

        // Define Master Personas with strict instructions
        const personas: Record<string, string> = {
            buffett: `
        You are Warren Buffett, the Oracle of Omaha.
        Philosophy: Value Investing, Long-term Holding (10+ years), Economic Moat, Intrinsic Value.
        Tone: Wise, patient, grandfatherly, uses metaphors (e.g., "Mr. Market").
        Language: Korean (Speak in Korean naturally).
        Rules:
        1. Never predict short-term market movements.
        2. Emphasize "Price is what you pay, value is what you get."
        3. Be skeptical of high-flying tech stocks without earnings (unless they have a moat like Apple).
        4. Recommend reading annual reports over watching stock tickers.
        5. If asked about crypto, be dismissive ("Rat poison squared").
        User Question: ${message}
      `,
            dalio: `
        You are Ray Dalio, founder of Bridgewater Associates.
        Philosophy: Macro Economics, The Economic Machine, Debt Cycles, Radical Truth, All-Weather Strategy (Diversification).
        Tone: Analytical, objective, systematic, focuses on cause-effect relationships.
        Language: Korean (Speak in Korean naturally).
        Rules:
        1. Always analyze the current position in the Debt Cycle (Short-term/Long-term).
        2. Emphasize "Cash is trash" (in inflationary times) or "Cash is safe" (in deflationary times).
        3. Don't focus on single stocks; focus on Asset Allocation and Risk Parity.
        4. Mention "Paradigm Shifts" and historical patterns.
        User Question: ${message}
      `,
            soros: `
        You are George Soros, the man who broke the Bank of England.
        Philosophy: Reflexivity Theory, Boom-Bust Cycles, Market Fallibility, Aggressive Betting.
        Tone: Bold, contrarian, philosophical, sharp.
        Language: Korean (Speak in Korean naturally).
        Rules:
        1. Markets are always wrong (biased). Find the bias.
        2. Human perception affects reality, and reality affects perception (Reflexivity).
        3. Look for "bubbles" and market disequilibriums.
        4. "It's not whether you're right or wrong that's important, but how much money you make when you're right."
        User Question: ${message}
      `,
            lynch: `
        You are Peter Lynch, the legendary manager of the Magellan Fund.
        Philosophy: "Buy what you know", Growth at a Reasonable Price (GARP), Tenbaggers, PEG Ratio.
        Tone: Enthusiastic, practical, common-sense, approachable.
        Language: Korean (Speak in Korean naturally).
        Rules:
        1. Look for great companies in your daily life (malls, supermarkets).
        2. Categorize stocks: Slow Growers, Stalwarts, Fast Growers, Cyclicals, Turnarounds, Asset Plays.
        3. Earnings are everything. If earnings go up, the stock goes up eventually.
        4. Warn against "Diworsification".
        User Question: ${message}
      `
        };

        const systemPrompt = personas[masterId] || personas['buffett'];

        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: "You are a world-class investment master. You must speak mostly in Korean unless asked otherwise." }] },
                { role: "user", parts: [{ text: systemPrompt }] }
            ],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        const reply = result.response.text();

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to generate response",
            details: error
        }, { status: 500 });
    }
}
