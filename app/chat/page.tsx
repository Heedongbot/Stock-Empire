'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Lock, Bell, Sparkles, User, Brain } from 'lucide-react';

export default function ChatPage() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black italic tracking-tighter">STOCK EMPIRE</h1>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">AI Masters Chat</p>
                        </div>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/analysis" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Analysis</Link>
                        <Link href="/market" className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Signals</Link>
                        <Link href="/marketplace" className="text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-not-allowed opacity-50">Store</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content - Coming Soon State */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Lock className="w-10 h-10 text-slate-400" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Feature Coming Soon</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                        AI MASTERS ARE<br />PREPARING...
                    </h2>

                    <p className="text-slate-400 font-bold text-lg mb-12 leading-relaxed">
                        워렌 버핏, 레이 달리오 등 전설적인 투자 대가들의<br className="hidden md:block" />
                        AI 페르소나와 실시간으로 대화할 수 있는 기능이 곧 오픈됩니다.<br />
                        <span className="text-blue-400">데이터 학습 및 튜닝 작업이 진행 중입니다.</span>
                    </p>

                    {/* Notification Form */}
                    {!isSubscribed ? (
                        <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email for updates"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white font-bold placeholder:text-slate-600 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                                <button type="submit" className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black transition-all flex items-center gap-2">
                                    <Bell className="w-4 h-4" /> Notify Me
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-3 font-bold uppercase tracking-widest">
                                * We'll never share your email. Priority access for early subscribers.
                            </p>
                        </form>
                    ) : (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 animate-fade-in-up">
                            <div className="flex items-center justify-center gap-2 text-green-400 font-black text-lg mb-1">
                                <Bell className="w-5 h-5 fill-current" /> You're on the list!
                            </div>
                            <p className="text-green-500/60 text-sm font-bold">
                                오픈 시 가장 먼저 알려드리겠습니다.
                            </p>
                        </div>
                    )}

                    {/* Master Avatars Preview */}
                    <div className="mt-16 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['🎩', '🧠', '💎', '📈'].map((avatar, i) => (
                            <div key={i} className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-2xl border-2 border-slate-700">
                                {avatar}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
