"use client";

import {
    Users, UserPlus, Activity,
    Database, ShieldCheck, ArrowLeft, BarChart3,
    TrendingUp, RefreshCw, Cpu, Clock, Zap, Terminal, Server, Crown
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import ServerStatusSection from "@/components/ServerStatusSection";

export default function AdminPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        dailySignups: 0,
        weeklySignups: 0,
        monthlySignups: 0,
        activeCrawlers: 0,
        aiLoad: "0.00s",
        historyCount: 0,
        lastBackup: "방금 전",
        systemStatus: "최적화됨",
        crawlerStatus: "대기 중",
        timestamp: "-",
        todayVisitors: 0,
        monthlyVisitors: 0
    });

    const [logs, setLogs] = useState([
        { id: 1, time: "21:40", type: "결제", message: "PRO 멤버십 신규 가입 (user_8291)", color: "blue" },
        { id: 2, time: "21:30", type: "시스템", message: "일일 뉴스 수집 배치 작업 완료", color: "green" },
        { id: 3, time: "21:15", type: "경고", message: "\"반도체\" 테마 검색 트래픽 급증 (+240%)", color: "orange" }
    ]);

    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();

            setStats(prev => ({
                ...prev,
                ...data,
                timestamp: new Date(data.timestamp).toLocaleTimeString('ko-KR')
            }));

            if (data.recentLogs && data.recentLogs.length > 0) {
                setLogs(prev => {
                    const newLogs = data.recentLogs.filter((newLog: any) => !prev.some(l => l.id === newLog.id));
                    if (newLogs.length === 0) return prev;
                    return [...newLogs, ...prev].slice(0, 8);
                });
            }
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
        const apiInterval = setInterval(fetchStats, 5000);
        return () => clearInterval(apiInterval);
    }, []);

    const handleRefresh = async () => {
        setLoading(true);
        await fetchStats();
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Top Navigation - Glassmorphism */}
            <nav className="border-b border-white/5 bg-[#0f172a]/40 backdrop-blur-2xl px-10 py-5 flex justify-between items-center sticky top-0 z-[100]">
                <div className="flex items-center gap-6">
                    <Link href="/" className="group p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-[-0.03em] flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <span className="uppercase italic">지휘 통제 본부</span>
                            <span className="text-slate-500 text-xs not-italic font-black bg-white/5 px-2.5 py-1 rounded-md ml-2 border border-white/5">ADMIN HQ</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">시스템 가동률</span>
                        <span className="text-xs font-mono font-bold text-white/80 tabular-nums">99.99% 가동 중</span>
                    </div>

                    <div className="flex items-center gap-4 pl-8 border-l border-white/10">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase leading-none tracking-widest mb-1 transition-all group-hover:text-blue-400">오퍼레이터</p>
                            <p className="text-sm font-black text-white italic tracking-tight">최고 사령관</p>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-12 h-12 rounded-2xl bg-[#0f172a] border border-white/10 flex items-center justify-center font-black italic text-xl text-blue-500 overflow-hidden">
                                C
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-10 py-12">

                {/* Section 1: Growth & Traffic Metrics */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <TrendingUp className="w-4 h-4" /> 성장 및 트래픽 현황
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent mx-8 opacity-50"></div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
                            마지막 동기화: {stats.timestamp}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Daily Users */}
                        <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all group relative overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40">
                            <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                                <UserPlus size={120} />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">일일 가입자</p>
                            <div className="flex items-end justify-between">
                                <h2 className="text-5xl font-black text-white tracking-tighter tabular-nums">{stats.dailySignups.toLocaleString()}</h2>
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-500">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Weekly Users */}
                        <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40">
                            <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12">
                                <Activity size={120} />
                            </div>
                            <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.2em] mb-6">주간 도달율</p>
                            <div className="flex items-end justify-between">
                                <h2 className="text-5xl font-black text-white tracking-tighter tabular-nums">{stats.weeklySignups.toLocaleString()}</h2>
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Visitors Today */}
                        <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500/30 transition-all group relative overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40">
                            <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-45">
                                <BarChart3 size={120} />
                            </div>
                            <p className="text-[10px] font-black text-amber-500/70 uppercase tracking-[0.2em] mb-6">오늘 방문자</p>
                            <div className="flex items-end justify-between">
                                <h2 className="text-5xl font-black text-white tracking-tighter tabular-nums">{stats.todayVisitors.toLocaleString()}</h2>
                                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                                    <Zap className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Monthly Summary */}
                        <div className="bg-[#0f172a]/30 border border-white/5 p-8 rounded-[2.5rem] hover:border-purple-500/30 transition-all group relative overflow-hidden backdrop-blur-sm shadow-2xl shadow-black/40">
                            <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-45">
                                <Crown size={120} />
                            </div>
                            <p className="text-[10px] font-black text-purple-500/70 uppercase tracking-[0.2em] mb-6">월간 활성 사용자</p>
                            <div className="flex items-end justify-between">
                                <h2 className="text-5xl font-black text-white tracking-tighter tabular-nums">{stats.monthlyVisitors.toLocaleString()}</h2>
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-500">
                                    <Crown className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Engine Status & Logs */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                    {/* Left: System Pipeline */}
                    <div className="xl:col-span-8 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Database className="w-4 h-4" /> 핵심 파이프라인 엔진
                            </h2>
                            <button
                                onClick={handleRefresh}
                                className={`group p-2 bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10 ${loading ? 'animate-spin' : ''}`}
                            >
                                <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-blue-500`} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            {/* Crawler Card */}
                            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-white/5 p-8 rounded-[3rem] group hover:border-blue-500/20 transition-all flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                        <Activity className="w-7 h-7" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">실시간 가동 중</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight mb-2 uppercase italic">지능형 뉴스 크롤러</h3>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                                        전 세계 금융 미디어를 실시간으로 감시하며 <span className="text-blue-400 font-bold">{stats.activeCrawlers}개 저널</span>과 동기화 중입니다.
                                    </p>
                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">지연 시간</span>
                                        <span className="text-xs font-mono font-bold text-white/40">142ms</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Analysis Card */}
                            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-white/5 p-8 rounded-[3rem] group hover:border-amber-500/20 transition-all flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                        <Cpu className="w-7 h-7" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">최적화 완료</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight mb-2 uppercase italic">워룸 AI 신경망 코어</h3>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                                        다중 레이어 NLP 엔진이 시장 심리를 분석하며 평균 부하는 <span className="text-amber-400 font-bold">{stats.aiLoad}</span>입니다.
                                    </p>
                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">모델</span>
                                        <span className="text-xs font-mono font-bold text-white/40">G-PRO-ALPHA</span>
                                    </div>
                                </div>
                            </div>

                            {/* Database Card */}
                            <div className="md:col-span-2 bg-gradient-to-r from-slate-900/50 via-slate-950/50 to-slate-900/50 border border-white/5 p-8 rounded-[3rem] group hover:border-purple-500/20 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                                        <Database className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white tracking-tight mb-1 uppercase italic">통합 인텔리전스 아카이브</h3>
                                        <p className="text-xs font-medium text-slate-500">
                                            전략적 데이터를 보관하는 영구 저장소로 현재 <span className="text-purple-400 font-bold">{stats.historyCount}개 노드</span>가 보존 중입니다.
                                        </p>
                                    </div>
                                </div>
                                <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 uppercase tracking-widest">
                                    아카이브 관리 <Clock className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Security Logs */}
                    <div className="xl:col-span-4 flex flex-col">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Terminal className="w-4 h-4" /> 시스템 운영 로그
                            </h2>
                        </div>

                        <div className="bg-[#0f172a]/20 border border-white/5 rounded-[3rem] p-10 flex-1 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px]"></div>
                            <div className="space-y-10 relative z-10">
                                {logs.map((log, idx) => (
                                    <div key={log.id} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full mt-1.5 ring-4 ring-offset-4 ring-offset-[#0f172a] ${log.color === 'blue' ? 'bg-blue-500 ring-blue-500/10' :
                                                    log.color === 'green' ? 'bg-emerald-500 ring-emerald-500/10' :
                                                        log.color === 'orange' ? 'bg-amber-500 ring-amber-500/10' :
                                                            'bg-slate-700 ring-slate-700/10'
                                                }`}></div>
                                            {idx !== logs.length - 1 && <div className="w-px flex-1 bg-white/5 mt-4 group-last:hidden"></div>}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-mono font-bold text-slate-500 tabular-nums">{log.time}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${log.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                                        log.color === 'green' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            log.color === 'orange' ? 'bg-amber-500/10 text-amber-500' :
                                                                'bg-white/5 text-slate-500'
                                                    }`}>
                                                    {log.type}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-white/80 leading-snug tracking-tight group-hover:text-white transition-colors">
                                                {log.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <button className="w-full py-4 mt-6 bg-white/5 border border-white/5 rounded-[1.5rem] text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]">
                                    전체 보안 로그 확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Server Infrastructure */}
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Server className="w-4 h-4" /> 하드웨어 및 인프라 노드
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent mx-8 opacity-50"></div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative">
                            <ServerStatusSection />
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-20 text-center">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
                        인가된 사용자 전용 접근 • 스톡 엠파이어 AI 퀀트 시스템 • v2.4.0
                    </p>
                </div>
            </main>
        </div>
    );
}
