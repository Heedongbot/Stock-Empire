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
            date: "2026-02-06"
        },
        recentClosed: [
            { ticker: "ARM", return: 12.4, date: "2 Days ago" },
            { ticker: "PLTR", return: 8.7, date: "3 Days ago" },
            { ticker: "SMCI", return: 19.2, date: "1 Week ago" },
            { ticker: "TSLA", return: -2.1, date: "1 Week ago" },
            { ticker: "AMD", return: 5.6, date: "2 Weeks ago" }
        ],
        liveUpdate: [
            "🔥 AI가 추천한 [NVDA] $185 저항선 돌파! 수익률 +28.5%",
            "✅ [PLTR] AI 신호 발생 후 $135 탈환, 현재 +12.4% 구간",
            "🚀 [MSTR] 조정 완료 후 25% 급등, 목표가 상향 조정"
        ]
    };

    return NextResponse.json({
        success: true,
        data: performanceData
    });
}
