"use client";

import {
    Users, UserPlus, CreditCard, Activity,
    Database, ShieldCheck, ArrowLeft, BarChart3,
    TrendingUp, RefreshCw, Cpu, Clock, Crown, Sparkles, AlertTriangle
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
    const [stats, setStats] = useState({
        totalUsers: 1284,
        newUsersToday: 42,
        proUsers: 190,
        revenue: "₩1,245,000",
        activeCrawlers: 42,
        aiLoad: "1.2s",
        historyCount: 156,
        lastBackup: "방금 전",
        systemStatus: "최적화됨"
    });

    const [logs, setLogs] = useState([
        { id: 1, time: "21:40", type: "SALE", message: "user_8291님이 PRO 멤버십을 활성화했습니다.", color: "blue" },
        { id: 2, time: "21:30", type: "SYSTEM", message: "일일 뉴스 배치 #14가 성공적으로 처리되었습니다.", color: "slate" },
        { id: 3, time: "21:15", type: "WARNING", message: "\"반도체\" 테마 검색 트래픽이 평소보다 240% 급증했습니다.", color: "orange" }
    ]);

    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(prev => ({
                ...prev,
                ...data
            }));

            // 실시간 로그 추가 시뮬레이션
            if (Math.random() > 0.7) {
                const now = new Date();
                const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                const newLog = {
                    id: Date.now(),
                    time: timeStr,
                    type: "SYSTEM",
                    message: `알파 노드 동기화 완료: ${Math.floor(Math.random() * 100)}건의 신규 데이터 처리`,
                    color: "green"
                };
                setLogs(prev => [newLog, ...prev.slice(0, 4)]);
            }
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
        const apiInterval = setInterval(fetchStats, 10000);
        const simInterval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                totalUsers: prev.totalUsers + (Math.random() > 0.85 ? 1 : 0),
                newUsersToday: prev.newUsersToday + (Math.random() > 0.95 ? 1 : 0),
            }));
        }, 2000);

        return () => {
            clearInterval(apiInterval);
            clearInterval(simInterval);
        };
    }, []);

    const handleRefresh = async () => {
        setLoading(true);
        await fetchStats();
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
            <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-xl transition-all group">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </Link>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-blue-500" /> 지휘 통제실 <span className="text-slate-500 text-sm not-italic font-black">(지휘 본부)</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" /> 시스템 실시간 감시 중
                    </span>
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase leading-none">관리자 모드</p>
                            <p className="text-xs font-black text-white italic">최고 사령관</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center font-black italic">
                            C
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="premium-card p-8 border-slate-800 bg-[#0f172a]/50 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={80} />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">총 사용자 현황</p>
                        <div className="flex items-end justify-between relative z-10">
                            <h2 className="text-4xl font-black text-white tracking-tighter">{stats.totalUsers.toLocaleString()}</h2>
                            <span className="text-green-500 text-[10px] font-black flex items-center gap-1 mb-1 bg-green-500/10 px-2 py-0.5 rounded-full">
                                <UserPlus className="w-3 h-3" /> +{stats.newUsersToday}
                            </span>
                        </div>
                    </div>

                    <div className="premium-card p-8 border-slate-800 bg-[#0f172a]/50 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Crown size={80} />
                        </div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">PRO 프리미엄 멤버십</p>
                        <div className="flex items-end justify-between relative z-10">
                            <h2 className="text-4xl font-black text-white tracking-tighter">{stats.proUsers}</h2>
                            <span className="text-indigo-500 text-[10px] font-black mb-1 italic uppercase tracking-widest flex items-center gap-1">
                                <Sparkles size={10} className="text-indigo-500 fill-indigo-500" /> 프리미엄 서비스
                            </span>
                        </div>
                    </div>

                    <div className="premium-card p-8 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity text-amber-500">
                            <TrendingUp size={80} />
                        </div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">이번 달 누적 매출</p>
                        <div className="flex items-end justify-between relative z-10">
                            <h2 className="text-4xl font-black text-white tracking-tighter">{stats.revenue}</h2>
                            <TrendingUp className="text-amber-500 w-6 h-6 mb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 premium-card p-8 border-slate-800 bg-[#0f172a]/50">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                <Database className="w-5 h-5 text-blue-500" /> 데이터 파이프라인 엔진 상태 <span className="text-[10px] text-slate-500 normal-case">(실시간 감시 중)</span>
                            </h3>
                            <button
                                onClick={handleRefresh}
                                className={`p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-500 ${loading ? 'animate-spin text-blue-500' : ''}`}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-slate-950/80 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-all">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">지능형 크롤러 엔진 <span className="text-[10px] text-slate-500 font-bold">(국내/해외)</span></p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{stats.activeCrawlers}개 글로벌 주요 경제 매체 실시간 동기화 중</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">수집 중</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-slate-950/80 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-all">
                                        <Cpu className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">AI 심층 분석 엔진 <span className="text-[10px] text-slate-500 font-bold">(AI 분석 코어)</span></p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">김대리 AI 분석 시스템: 평균 응답 속도 {stats.aiLoad}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">정상 가동</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-slate-950/80 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-all">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">데이터 아카이브 <span className="text-[10px] text-slate-500 font-bold">(저장소)</span></p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">누적 기록: {stats.historyCount}건 (보존 기간: 14일)</p>
                                    </div>
                                </div>
                                <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 transition-all">
                                    아카이브 열람 <Clock size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-8 border-slate-800 bg-[#0f172a]/50">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-2">
                            <BarChart3 size={18} className="text-slate-400" /> 관리자 로그 시스템
                        </h3>
                        <div className="space-y-8">
                            {logs.map(log => (
                                <div key={log.id} className={`flex gap-4 border-l-2 ${log.color === 'blue' ? 'border-blue-500' : log.color === 'green' ? 'border-green-500' : log.color === 'orange' ? 'border-orange-500' : 'border-slate-800'} pl-5 py-1 animate-fade-in`}>
                                    <div className="flex-1">
                                        <p className={`text-[10px] font-black ${log.color === 'orange' ? 'text-orange-500' : 'text-slate-500'} uppercase mb-1 tracking-widest`}>
                                            {log.time} | {log.type === 'SALE' ? '신규 결제' : log.type === 'WARNING' ? '서버 경고' : '시스템 알림'}
                                        </p>
                                        <p className="text-xs font-black text-white tracking-tight">
                                            {log.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
