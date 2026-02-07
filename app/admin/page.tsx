"use client";

import {
    Users, UserPlus, CreditCard, Activity,
    Database, ShieldCheck, ArrowLeft, BarChart3,
    TrendingUp, RefreshCw, Cpu
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
    const [stats, setStats] = useState({
        totalUsers: 5,
        newUsersToday: 1,
        vipUsers: 1, // Commander (Backdoor PRO)
        vvipUsers: 1, // Commander
        revenue: "₩0", // Beta Period
        activeCrawlers: 42,
        aiLoad: "0.8s",
        historyCount: 156,
        lastBackup: "방금 전",
        systemStatus: "최적화됨"
    });

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* Sidebar / Nav */}
            <nav className="border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                        <ArrowLeft className="w-5 h-5 text-slate-400 theme-hover:text-white" />
                    </Link>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-blue-500" /> 지휘 통제실 (Commander Cockpit)
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full" /> 시스템 가동 중
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden" />
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-10">

                {/* STATS OVERVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="premium-card p-6 border-slate-800 bg-slate-900/50">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">총 사용자 (Total Users)</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}명</h2>
                            <span className="text-green-500 text-[10px] font-bold flex items-center gap-1 mb-1">
                                <UserPlus className="w-3 h-3" /> +{stats.newUsersToday}
                            </span>
                        </div>
                    </div>
                    <div className="premium-card p-6 border-slate-800 bg-slate-900/50">
                        <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2">PRO 멤버 (유료 회원)</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-white">{stats.vipUsers}명</h2>
                            <span className="text-slate-500 text-[10px] font-bold mb-1">전환율: 20%</span>
                        </div>
                    </div>
                    <div className="premium-card p-6 border-slate-800 bg-slate-900/50">
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">VVIP 리더그룹</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-white">{stats.vvipUsers}명</h2>
                            <span className="text-purple-500 text-[10px] font-bold mb-1 italic">👑 Ultra Premium</span>
                        </div>
                    </div>
                    <div className="premium-card p-6 border-[#d4af37]/20 bg-[#d4af37]/5">
                        <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2">이번 달 수익</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-white">{stats.revenue}</h2>
                            <TrendingUp className="text-[#d4af37] w-6 h-6 mb-1" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* SYSTEM STATUS */}
                    <div className="lg:col-span-2 premium-card p-8 border-slate-800 bg-slate-900/50">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Database className="w-5 h-5 text-blue-500" /> 데이터 파이프라인 & 기록 (2주)
                            </h3>
                            <button className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-500">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">크롤러 엔진 (한국/미국)</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">42개 저널 실시간 동기화 중</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-green-500">정상 가동 (ACTIVE)</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">AI 분석 엔진 (김대리)</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">평균 응답 지연시간: 0.8초</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-green-500">안정적 (STABLE)</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">데이터 보관소 (Archive)</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{stats.historyCount}개 기록 저장됨 (목표: 14일치)</p>
                                    </div>
                                </div>
                                <Link href={`#`} className="text-[10px] font-black text-blue-400 underline underline-offset-4">아카이브 보기</Link>
                            </div>
                        </div>
                    </div>

                    {/* ADMIN NOTES / LOG */}
                    <div className="premium-card p-8 border-slate-800 bg-slate-900/50">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-8">관리자 이벤트 로그</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4 border-l-2 border-blue-500 pl-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">21:40 | NEW USER</p>
                                    <p className="text-xs font-bold text-white">"lgh425"님이 VVIP 권한을 획득했습니다.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 border-l-2 border-slate-800 pl-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">21:30 | SYSTEM</p>
                                    <p className="text-xs font-bold text-white">일일 뉴스 배치 #12 처리 완료</p>
                                </div>
                            </div>
                            <div className="flex gap-4 border-l-2 border-orange-500 pl-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-orange-500 uppercase mb-1">21:15 | WARNING</p>
                                    <p className="text-xs font-bold text-white italic">"반도체" 테마 검색 트래픽 급증</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
