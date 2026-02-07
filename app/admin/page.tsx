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
        totalUsers: 1284,
        newUsersToday: 42,
        vipUsers: 156,
        vvipUsers: 34,
        revenue: "₩1,245,000",
        activeCrawlers: 2,
        aiLoad: "12%",
        historyCount: 156,
        lastBackup: "1시간 전",
        systemStatus: "정상"
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
                        <ShieldCheck className="w-6 h-6 text-blue-500" /> Commander Cockpit
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full" /> System Online
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden" />
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-10">

                {/* STATS OVERVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="premium-card p-6 border-slate-800 bg-slate-900/50">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Users</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}</h2>
                            <span className="text-green-500 text-[10px] font-bold flex items-center gap-1 mb-1">
                                <UserPlus className="w-3 h-3" /> +{stats.newUsersToday}
                            </span>
                        </div>
                    </div>
                    <div className="premium-card p-6 border-slate-800 bg-slate-900/50">
                        <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2">VIP Members</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-white">{stats.vipUsers}</h2>
                            <span className="text-slate-500 text-[10px] font-bold mb-1">Conversion: 12%</span>
                        </div>
                    </div>
                    <div className="premium-card p-6 border-slate-800 bg-slate-900/50">
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">VVIP Leaders</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-3xl font-black text-white">{stats.vvipUsers}</h2>
                            <span className="text-purple-500 text-[10px] font-bold mb-1 italic">👑 Ultra Premium</span>
                        </div>
                    </div>
                    <div className="premium-card p-6 border-[#d4af37]/20 bg-[#d4af37]/5">
                        <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2">MTD Revenue</p>
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
                                <Database className="w-5 h-5 text-blue-500" /> Pipeline & History (2 Weeks)
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
                                        <p className="text-xs font-black text-white">Crawler Engine (KR/US)</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Syncing 42 source journals</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-green-500">ACTIVE</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">AI Analysis Engine</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Kim Daeri AI consultation: 1.2s avg latency</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-green-500">STABLE</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">Data Retention (Archive)</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{stats.historyCount} records saved (Target: 14 days)</p>
                                    </div>
                                </div>
                                <Link href={`#`} className="text-[10px] font-black text-blue-400 underline underline-offset-4">VIEW ARCHIVE</Link>
                            </div>
                        </div>
                    </div>

                    {/* ADMIN NOTES / LOG */}
                    <div className="premium-card p-8 border-slate-800 bg-slate-900/50">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-8">Admin Event Log</h3>
                        <div className="space-y-6">
                            <div className="flex gap-4 border-l-2 border-blue-500 pl-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">21:40 | NEW SALE</p>
                                    <p className="text-xs font-bold text-white">VVIP Membership activated by user_8291</p>
                                </div>
                            </div>
                            <div className="flex gap-4 border-l-2 border-slate-800 pl-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">21:30 | SYSTEM</p>
                                    <p className="text-xs font-bold text-white">Daily News batch #12 processed successfully</p>
                                </div>
                            </div>
                            <div className="flex gap-4 border-l-2 border-orange-500 pl-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-orange-500 uppercase mb-1">21:15 | WARNING</p>
                                    <p className="text-xs font-bold text-white italic">Higher than usual traffic for "Semiconductor" theme query</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
