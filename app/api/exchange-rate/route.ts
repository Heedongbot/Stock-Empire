import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', { next: { revalidate: 3600 } }); // 1시간 캐시
        const data = await res.json();
        const rate = data.rates.KRW;

        return NextResponse.json({ rate });
    } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        return NextResponse.json({ rate: 1400 }); // 실패 시 기본값 (보수적)
    }
}
