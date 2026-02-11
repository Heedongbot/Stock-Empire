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
