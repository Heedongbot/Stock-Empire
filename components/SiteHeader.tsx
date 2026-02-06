'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';
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
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const toggleLang = () => {
        if (setLang) {
            setLang(lang === 'ko' ? 'en' : 'ko');
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginEmail) {
            const res = login(loginEmail, loginPassword, 'FREE');
            if (res.success) {
                setShowLoginModal(false);
                setLoginEmail('');
                setLoginPassword('');
                setLoginError('');
            } else {
                setLoginError(res.message || 'Login Failed');
            }
        }
    };

    const NAV_ITEMS = [
        { id: 'dashboard', path: '/dashboard' },
        { id: 'news', path: '/news' },
        { id: 'analysis', path: '/analysis' },
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
                                            {user.role === 'ADMIN' ? 'COMMANDER' : `${user.tier} MEMBER`}
                                        </span>
                                    </div>
                                    <div className="relative group/avatar">
                                        <img src={user.avatar} alt="Avatar" className={`w-9 h-9 rounded-xl border bg-slate-800 ${user.role === 'ADMIN' ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-slate-700'}`} />
                                        <button
                                            onClick={logout}
                                            className="absolute top-full right-0 mt-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-black uppercase"
                                        >
                                            <LogOut className="w-3 h-3 inline mr-1" /> Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    <LogIn className="w-4 h-4" /> {lang === 'ko' ? '로그인' : 'Login'}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </header>

            {/* Simple Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
                    <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-8">
                        <h3 className="text-xl font-black text-white italic mb-6 uppercase tracking-widest">Portal Access</h3>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Identity</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="your@email.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Access Key</label>
                                <input
                                    type="password"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="••••••••"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                            {loginError && (
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter">{loginError}</p>
                            )}
                            <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                                Initialize Login
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
