import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { TICKER_MAP } from '@/lib/stocks';

const execPromise = promisify(exec);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('ticker')?.trim() || '';

    // 공유 매핑 데이터 사용
    const ticker = (TICKER_MAP[query] || query).toUpperCase();

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    try {
        // [NOTEBOOK LM BRIDGE]
        // 대표님의 요청에 따라 외부 API(Gemini/OpenAI) 대신 
        // 이미 학습된 로컬 NotebookLM을 사용하여 분석을 수행합니다.

        // 1. Python 스크립트 경로 설정 (연구자동화 폴더 내 notebook_analyst.py)
        // Next.js 앱이 stock-empire 폴더에 있으므로 한 단계 상위 폴더를 참조합니다.
        const scriptPath = path.join(process.cwd(), '..', 'notebook_analyst.py');
        const fs = require('fs');

        // Vercel 환경이거나 스크립트가 없는 경우 시뮬레이션 모드 작동
        const isVercel = process.env.VERCEL === '1';
        const scriptExists = fs.existsSync(scriptPath);

        if (isVercel || !scriptExists) {
            console.log('Running in Cloud/Demo mode (Local Bridge disconnected)');

            // 시뮬레이션용 데이터 생성 (초보자에게 보여줄 데모용)
            return NextResponse.json({
                ticker: ticker,
                name: ticker === query.toUpperCase() ? ticker : query,
                strategy: "Empire AI Intelligent Engine (Demo)",
                price: 154.32,
                change_pct: 1.24,
                sentiment: "BULLISH",
                impact_score: 88,
                target_price: 178.50,
                stop_loss: 142.00,
                ai_reason: "클라우드 데모 버전입니다. 로컬 환경에서 NotebookLM 연결 시 정밀 분석이 실행됩니다.",
                technical_analysis: "차트가 아주 예쁜 정배열을 유지하고 있어요! 지금처럼 좋은 흐름이라면 조만간 전고점을 돌파할 기미가 보입니다. (시뮬레이션 데이터)",
                fundamental_analysis: "이 회사는 돈을 아주 잘 벌고 있어요! 실적 발표 때마다 깜짝 놀랄 성과를 내고 있어서 믿음직스럽습니다. (시뮬레이션 데이터)",
                action_plan: "지금은 조금씩 모아가도 좋은 시기에요! 목표가인 $178 근처까지는 느긋하게 기다려보는 건 어떨까요? (시뮬레이션 데이터)",
                id: `${ticker}-${Date.now()}`,
                updated_at: new Date().toISOString(),
                is_real_time: false,
                is_demo: true,
                source: "NotebookLM Cloud Simulation"
            });
        }

        // 2. Python 실행 및 결과 수신
        const command = `python "${scriptPath}" ${ticker}`;

        // Timeout 60s (NotebookLM이 생각하는 시간이 필요함)
        const { stdout, stderr } = await execPromise(command, { timeout: 60000 });

        if (stderr) {
            console.warn('Python Warning:', stderr);
        }

        const result = JSON.parse(stdout);

        if (result.error) {
            return NextResponse.json({
                error: result.error,
                code: 'NOTEBOOK_LM_ERROR'
            }, { status: 500 });
        }

        // 3. 응답 메타데이터 추가
        result.id = `${ticker}-${Date.now()}`;
        result.updated_at = new Date().toISOString();
        result.is_real_time = true;
        result.source = "NotebookLM Intelligent Engine";

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Ticker Analysis Bridge Error:', error);
        return NextResponse.json({
            error: 'NotebookLM 분석 엔진 호출 실패. 로컬 서버에서 Python 및 NotebookLM MCP가 실행 중인지 확인하세요.',
            details: error.message
        }, { status: 500 });
    }
}
