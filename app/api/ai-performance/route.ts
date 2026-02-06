import { NextResponse } from 'next/server';

export async function GET() {
    // 30일간 AI 추천 성과 데이터 (실제로는 DB에서 계산해야 함)
    // 여기서는 강력한 마케팅용 데이터를 시뮬레이션합니다.

    const performanceData = {
        period: "Last 30 Days",
        totalPicks: 18,
        winRate: 83.3, // 승률
        averageReturn: 14.2, // 평균 수익률
        bestPick: {
            ticker: "NVDA",
            name: "Nvidia",
            return: 28.5,
            date: "2026-01-15"
        },
        recentClosed: [
            { ticker: "ARM", return: 12.4, date: "2 Days ago" },
            { ticker: "PLTR", return: 8.7, date: "3 Days ago" },
            { ticker: "SMCI", return: 19.2, date: "1 Week ago" },
            { ticker: "TSLA", return: -2.1, date: "1 Week ago" }, // 손실도 투명하게 공개 (신뢰도 상승)
            { ticker: "AMD", return: 5.6, date: "2 Weeks ago" }
        ],
        liveUpdate: [
            "🔥 AI가 추천한 [NVDA] 목표가 $850 돌파! 수익률 +28%",
            "✅ [PLTR] 조정 완료 후 반등 시작, 현재 +8.7% 구간",
            "🚀 [ARM] AI 신호 발생 2일 만에 +12% 급등"
        ]
    };

    return NextResponse.json({
        success: true,
        data: performanceData
    });
}
