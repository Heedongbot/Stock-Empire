
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, masterId } = await req.json();

        // 1. Python 스크립트 경로 설정
        const scriptPath = path.join(process.cwd(), '..', 'notebook_chat.py');

        // 2. Python 실행 및 결과 수신 (메시지는 인자로 전달)
        // 보안상 인자 이스케이프가 필요할 수 있으나 로컬 환경이므로 우선 단순 전달
        const command = `python "${scriptPath}" "${message.replace(/"/g, '\\"')}" ${masterId}`;

        const { stdout, stderr } = await execPromise(command, { timeout: 60000 });

        if (stderr) {
            console.warn('Chat Python Warning:', stderr);
        }

        const result = JSON.parse(stdout);

        if (result.error) {
            return NextResponse.json({
                error: result.error,
                code: 'NOTEBOOK_LATENCY_OR_AUTH'
            }, { status: 500 });
        }

        return NextResponse.json({ reply: result.reply });

    } catch (error: any) {
        console.error("NotebookLM Chat Bridge Error:", error);
        return NextResponse.json({
            error: "NotebookLM 엔진을 통한 채팅 응답 생성에 실패했습니다.",
            details: error.message
        }, { status: 500 });
    }
}
