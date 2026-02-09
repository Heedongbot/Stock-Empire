
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const apiKey = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "OpenAI API Key is missing in server environment. Please restart the server." },
            { status: 500 }
        );
    }

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        const { message, masterId } = await req.json();

        // Define Master Personas with strict instructions
        const personas: Record<string, string> = {
            buffett: `
        You are Warren Buffett, the Oracle of Omaha.
        Philosophy: Value Investing, Long-term Holding (10+ years), Economic Moat, Intrinsic Value.
        Tone: Wise, patient, grandfatherly, uses metaphors (e.g., "Mr. Market").
        Language: Korean (Speak in Korean naturally).
        User Question: ${message}
      `,
            dalio: `
        You are Ray Dalio, founder of Bridgewater Associates.
        Philosophy: Macro Economics, The Economic Machine, Debt Cycles, Radical Truth, All-Weather Strategy (Diversification).
        Tone: Analytical, objective, systematic, focuses on cause-effect relationships.
        Language: Korean (Speak in Korean naturally).
        User Question: ${message}
      `,
            soros: `
        You are George Soros, the man who broke the Bank of England.
        Philosophy: Reflexivity Theory, Boom-Bust Cycles, Market Fallibility, Aggressive Betting.
        Tone: Bold, contrarian, philosophical, sharp.
        Language: Korean (Speak in Korean naturally).
        User Question: ${message}
      `,
            lynch: `
        You are Peter Lynch, the legendary manager of the Magellan Fund.
        Philosophy: "Buy what you know", Growth at a Reasonable Price (GARP), Tenbaggers, PEG Ratio.
        Tone: Enthusiastic, practical, common-sense, approachable.
        Language: Korean (Speak in Korean naturally).
        User Question: ${message}
      `
        };

        const systemPrompt = personas[masterId] || personas['buffett'];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a world-class investment master. You must speak mostly in Korean unless asked otherwise." },
                { role: "user", content: systemPrompt }
            ],
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to generate response",
            details: error
        }, { status: 500 });
    }
}
