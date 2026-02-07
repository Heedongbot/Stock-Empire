'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Menu, X, ChevronRight, Globe, ShieldCheck,
    LayoutDashboard, Newspaper, BarChart3, PieChart,
    LogOut, User, Settings, Crown, LogIn, UserPlus
} from "lucide-react";
import { translations } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

interface SiteHeaderProps {
    lang?: 'ko' | 'en';
    setLang?: (lang: 'ko' | 'en') => void;
}

export default function SiteHeader({ lang = 'ko', setLang }: SiteHeaderProps) {
    const pathname = usePathname();
    const t = translations[lang];
    const { user, login, logout, isLoading } = useAuth();

    // Auth States
    const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const toggleLang = () => {
        if (setLang) {
            setLang(lang === 'ko' ? 'en' : 'ko');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (authMode === 'LOGIN') {
            const res = login(email, password, 'FREE');
            if (res.success) {
                setAuthMode(null);
                resetForm();
            } else {
                setError(res.message || 'Login Failed');
            }
        } else {
            // 회원가입 로직 (현재는 목업으로 로그인과 동일하게 처리)
            const res = login(email, password, 'FREE');
            if (res.success) {
                setAuthMode(null);
                resetForm();
                alert(lang === 'ko' ? '회원가입이 완료되었습니다!' : 'Signup Complete!');
            }
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    };

    const NAV_ITEMS = [
        { id: 'dashboard', path: '/dashboard' },
        { id: 'news', path: '/news' },
        { id: 'analysis', path: '/analysis' },
        { id: 'themes', path: '/themes' },
        { id: 'vvip_alpha', path: '/vvip-alpha' },
        { id: 'market', path: '/market' },
        { id: 'portfolio', path: '/portfolio' },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 bg-[#050b14]/80 backdrop-blur-md border-b border-slate-800 h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center min-w-[160px]">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <Globe className="w-6 h-6 text-white animate-pulse-slow" />
                            </div>
                            <span className="text-xl font-black italic tracking-tighter text-white uppercase whitespace-nowrap">
                                STOCK<span className="text-indigo-400">EMPIRE</span>
                            </span>
                        </Link>
                    </div>

                    {/* Nav - Centered & Flexible */}
                    <nav className="hidden lg:flex flex-1 items-center justify-center gap-3 xl:gap-8 px-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.path;
                            const isVVIP = item.id === 'vvip_alpha' || item.id === 'market';

                            return (
                                <Link
                                    key={item.id}
                                    href={item.path}
                                    className={`text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all relative group whitespace-nowrap flex items-center gap-1 xl:gap-1.5 ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] rounded-full animate-pulse"></div>
                                    )}
                                    {isVVIP && <Crown className={`w-3 h-3 ${isActive ? 'text-indigo-400 fill-indigo-400/20' : 'text-yellow-500/50 group-hover:text-yellow-500'}`} />}
                                    {t.nav[item.id as keyof typeof t.nav]}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Utility Zone - Pinned Right */}
                    <div className="flex-shrink-0 flex items-center gap-2 xl:gap-4 ml-4 min-w-max">
                        {/* Divider */}
                        <div className="hidden xl:block w-[1px] h-6 bg-slate-800"></div>

                        <div className="flex items-center gap-2">
                            {/* Admin HQ Button */}
                            {user?.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className="h-9 px-3 xl:px-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 group/hq"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5 group-hover/hq:animate-bounce" />
                                    <span className="hidden xl:inline">{t.auth.hq}</span>
                                </Link>
                            )}

                            {/* Language Selector */}
                            <button
                                onClick={toggleLang}
                                className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 text-[10px] font-black text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all uppercase flex items-center gap-1.5"
                            >
                                <Globe className="w-3.5 h-3.5 text-slate-500" />
                                {lang === 'ko' ? 'ENG' : 'KOR'}
                            </button>
                        </div>

                        {/* Auth / Avatar Section */}
                        <div className="flex items-center gap-3 pl-2 xl:pl-4 border-l border-slate-800">
                            {!isLoading && (
                                user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="hidden xl:flex flex-col items-end">
                                            <span className="text-[10px] font-black text-white leading-none mb-1">{user.name}</span>
                                            <span className={`text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded bg-slate-900 border ${user.role === 'ADMIN' ? 'text-red-500 border-red-500/20' : 'text-indigo-400 border-indigo-500/20'}`}>
                                                {user.role === 'ADMIN' ? t.auth.commander : `${user.tier} ${t.auth.member}`}
                                            </span>
                                        </div>
                                        <div className="relative group/avatar">
                                            <div className={`p-0.5 rounded-xl bg-gradient-to-tr ${user.role === 'ADMIN' ? 'from-red-600 to-red-400' : 'from-indigo-600 to-blue-400'} shadow-lg`}>
                                                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-[10px] bg-slate-950 object-cover" />
                                            </div>
                                            <button
                                                onClick={logout}
                                                className="absolute top-full right-0 mt-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-red-400 opacity-0 group-hover/avatar:opacity-100 transition-all hover:shadow-xl hover:shadow-red-500/10 whitespace-nowrap text-[10px] font-black uppercase flex items-center gap-2 pointer-events-none group-hover/avatar:pointer-events-auto translate-y-2 group-hover/avatar:translate-y-0"
                                            >
                                                <LogOut className="w-3.5 h-3.5" /> {t.auth.logout}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setAuthMode('LOGIN')}
                                            className="px-3 xl:px-4 py-2 hover:text-white text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            {t.auth.portalAccess}
                                        </button>
                                        <button
                                            onClick={() => setAuthMode('SIGNUP')}
                                            className="px-3 xl:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                        >
                                            {t.auth.createIdentity}
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Auth Modal */}
            {authMode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAuthMode(null)} />
                    <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-8">
                        <button onClick={() => setAuthMode(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-black text-white italic mb-6 uppercase tracking-widest">
                            {authMode === 'LOGIN' ? t.auth.portalAccess : t.auth.createIdentity}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {authMode === 'SIGNUP' && (
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{t.auth.fullName}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{t.auth.emailAddress}</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{t.auth.accessKey}</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter">{error}</p>
                            )}

                            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                                {authMode === 'LOGIN' ? t.auth.initializeLogin : t.auth.registerIdentity}
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                                    className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest"
                                >
                                    {authMode === 'LOGIN' ? t.auth.noId : t.auth.haveId}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
