import { NextResponse } from 'next/server';

export async function GET() {
    // Simulated Admin Data
    return NextResponse.json({
        totalUsers: 1428,
        newUsersToday: 56,
        vipUsers: 182,
        vvipUsers: 41,
        revenueDaily: 125000,
        revenueMonthly: 3850000,
        activeCrawlers: 2,
        aiLoad: "14%",
        historyCount: 168,
        systemStatus: "Operational"
    });
}
