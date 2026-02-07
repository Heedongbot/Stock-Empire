import { NextResponse } from "next/server";

// 실시간 집계 시뮬레이션 엔진 (Real-time aggregation simulation engine)
// 실제 DB가 연결되기 전까지는 이 엔진이 동적인 데이터를 생성합니다.
export async function GET() {
    // 2026-02-07 18:00 기준 베이스 라인
    const baseTotalUsers = 1284;
    const baseProUsers = 190; // VIP + VVIP 합산치 반영
    const baseRevenue = 1245000;

    // 현재 시간에 따른 미세 변동 (실시간 시뮬레이션)
    const now = new Date();
    // 2026-02-07 00:00:00 기준 경과 시간 (ms)
    const baseDate = new Date('2026-02-07T00:00:00Z');
    const msSinceBase = now.getTime() - baseDate.getTime();

    // 1분당 약 0.15명 증가
    const addedUsers = Math.floor(msSinceBase / 7000);
    const addedPros = Math.floor(addedUsers * 0.18); // PRO 전환율 설정

    const stats = {
        totalUsers: baseTotalUsers + addedUsers,
        newUsersToday: 42 + Math.floor(msSinceBase / 400000),
        proUsers: baseProUsers + addedPros,
        revenue: `₩${(baseRevenue + (addedPros * 42000) + (Math.random() * 10000)).toLocaleString()}`,
        activeCrawlers: 42 + (Math.random() > 0.8 ? 1 : 0),
        aiLoad: `${(0.7 + Math.random() * 0.4).toFixed(2)}s`,
        historyCount: 156 + Math.floor(msSinceBase / 150000),
        timestamp: now.toISOString()
    };

    return NextResponse.json(stats);
}
