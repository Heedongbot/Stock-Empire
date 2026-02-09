
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    const { type, payload } = await request.json();
    const dataPath = path.join(process.cwd(), 'data', 'analytics.json');

    try {
        let data = {
            total_visitors: 0,
            daily_visitors: {} as Record<string, number>,
            monthly_visitors: {} as Record<string, number>,
            total_users: 0,
            pro_users: 0,
            monthly_revenue: 0,
            payments: [] as any[]
        };

        if (fs.existsSync(dataPath)) {
            const raw = fs.readFileSync(dataPath, 'utf-8');
            data = JSON.parse(raw);
        }

        const today = new Date().toISOString().split('T')[0];
        const month = today.substring(0, 7);

        if (type === 'VISIT') {
            data.total_visitors = (data.total_visitors || 0) + 1;
            data.daily_visitors[today] = (data.daily_visitors[today] || 0) + 1;
            data.monthly_visitors[month] = (data.monthly_visitors[month] || 0) + 1;
        } else if (type === 'PAYMENT') {
            const amount = payload.amount || 0;
            data.monthly_revenue = (data.monthly_revenue || 0) + amount;
            data.pro_users = (data.pro_users || 0) + 1;
            data.payments = data.payments || [];
            data.payments.push({
                id: Date.now(),
                amount,
                plan: payload.plan,
                timestamp: new Date().toISOString()
            });
        } else if (type === 'SIGNUP') {
            data.total_users = (data.total_users || 0) + 1;
        }

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Tracking Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
