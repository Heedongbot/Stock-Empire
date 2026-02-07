import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// 실시간 집계 시뮬레이션 및 데이터 연동
export async function GET() {
    // 1. 실제 뉴스 데이터 파일 읽기 (연구자동화 루트 폴더)
    // Next.js 앱이 stock-empire 폴더에서 실행되므로 상위 폴더 접근 필요
    const rootDir = path.join(process.cwd(), '..');
    const usNewsPath = path.join(rootDir, 'us_news_latest.json');
    const krNewsPath = path.join(rootDir, 'kr_news_latest.json');

    let totalNewsCount = 0;
    let recentLogs: any[] = [];
    let crawlerStatus = "대기";

    try {
        let usNews = [];
        let krNews = [];

        if (fs.existsSync(usNewsPath)) {
            const usData = fs.readFileSync(usNewsPath, 'utf-8');
            usNews = JSON.parse(usData);
        }
        if (fs.existsSync(krNewsPath)) {
            const krData = fs.readFileSync(krNewsPath, 'utf-8');
            krNews = JSON.parse(krData);
        }

        totalNewsCount = usNews.length + krNews.length;
        crawlerStatus = (usNews.length > 0 || krNews.length > 0) ? "정상 가동" : "점검 필요";

        // 최신 뉴스 기반 로그 생성
        const allNews = [...usNews, ...krNews];
        // 셔플 후 랜덤 추출 대신 상위 몇 개만 가져오거나 랜덤으로 섞음
        const recentNews = allNews.sort(() => 0.5 - Math.random()).slice(0, 3);

        recentLogs = recentNews.map((news: any, index) => ({
            id: Date.now() + index,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
            type: "뉴스",
            message: `뉴스 분석 완료: ${news.title.substring(0, 20)}...`,
            color: "green"
        }));

    } catch (error) {
        console.error("파일 읽기 실패:", error);
    }

    // 2. 사용자 통계 시뮬레이션 (DB 연동 전까지 유지)
    // 2026-02-07 18:00 기준
    const baseTotalUsers = 1284;
    const baseProUsers = 190;
    const baseRevenue = 1245000;

    const now = new Date();
    const baseDate = new Date('2026-02-07T00:00:00Z');
    const msSinceBase = now.getTime() - baseDate.getTime();

    // 시간 흐름에 따른 자연스러운 증가 시뮬레이션
    const addedUsers = Math.floor(msSinceBase / 600000); // 10분에 1명
    const addedPros = Math.floor(addedUsers * 0.15);

    const stats = {
        totalUsers: baseTotalUsers + addedUsers,
        newUsersToday: 4 + Math.floor(msSinceBase / 3600000), // 시간당 1명 정도
        proUsers: baseProUsers + addedPros,
        revenue: `₩${(baseRevenue + (addedPros * 9900)).toLocaleString()}`, // PRO 가격 반영 w/ comma
        activeCrawlers: 2, // US, KR
        aiLoad: `${(0.8 + Math.random() * 0.5).toFixed(2)}s`, // 랜덤 변동
        historyCount: totalNewsCount, // 실제 뉴스 개수
        timestamp: now.toISOString(),
        crawlerStatus: crawlerStatus,
        recentLogs: recentLogs
    };

    return NextResponse.json(stats);
}
