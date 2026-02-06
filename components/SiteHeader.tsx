'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, LogIn, LogOut, User, ShieldCheck, UserPlus, X } from 'lucide-react';
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
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <Globe className="w-6 h-6 text-white animate-pulse-slow" />
                        </div>
                        <span className="text-xl font-black italic tracking-tighter text-white uppercase">
                            STOCK<span className="text-indigo-400">EMPIRE</span>
                        </span>
                    </Link>

                    {/* Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.path}
                                    className={`text-sm font-black uppercase tracking-widest transition-colors relative group ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {t.nav[item.id as keyof typeof t.nav]}
                                    {isActive && (
                                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)]"></span>
                                    )}
                                </Link>
                            );
                        })}
                        {user?.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                            >
                                <ShieldCheck className="w-3 h-3" /> {t.auth.hq}
                            </Link>
                        )}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLang}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase hover:border-indigo-500/50"
                        >
                            {lang === 'ko' ? 'ENG' : 'KOR'}
                        </button>

                        {!isLoading && (
                            user ? (
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <div className="flex items-center gap-1">
                                            {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3 text-red-500 animate-pulse" />}
                                            <span className="text-[10px] font-black text-white">{user.name}</span>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-tighter ${user.role === 'ADMIN' ? 'text-red-500' : 'text-indigo-400'}`}>
                                            {user.role === 'ADMIN' ? t.auth.commander : `${user.tier} ${t.auth.member}`}
                                        </span>
                                    </div>
                                    <div className="relative group/avatar">
                                        <img src={user.avatar} alt="Avatar" className={`w-9 h-9 rounded-xl border bg-slate-800 ${user.role === 'ADMIN' ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-slate-700'}`} />
                                        <button
                                            onClick={logout}
                                            className="absolute top-full right-0 mt-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-black uppercase"
                                        >
                                            <LogOut className="w-3 h-3 inline mr-1" /> {t.auth.logout}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setAuthMode('LOGIN')}
                                        className="flex items-center gap-2 px-5 py-2 hover:text-white text-slate-400 text-xs font-black uppercase tracking-widest transition-all"
                                    >
                                        <LogIn className="w-4 h-4" /> {t.auth.portalAccess}
                                    </button>
                                    <button
                                        onClick={() => setAuthMode('SIGNUP')}
                                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        <UserPlus className="w-4 h-4" /> {t.auth.createIdentity}
                                    </button>
                                </div>
                            )
                        )}
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
