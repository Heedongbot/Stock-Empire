'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpRight, Sparkles, ChevronRight, Activity,
  TrendingUp, TrendingDown, Cpu, Zap, Lock,
  ShieldCheck, CheckCircle2, Crown, Activity as ActivityIcon,
  BookOpen, MessageSquare, Award, Loader2, Milestone, Database
} from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import Ticker from '@/components/Ticker';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import QuizWidget from '@/components/QuizWidget';
import PaymentModal from '@/components/PaymentModal';
import { translations } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';
import NewsTeaser from '@/components/NewsTeaser';

interface AlphaSignal {
  ticker: string;
  name: string;
  price: number;
  change_pct: number;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  impact_score: number;
  target_price: number;
  stop_loss: number;
  ai_reason: string;
}

export default function Home() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const t = (translations as any)[lang];
  const { user, updateTier } = useAuth();
  const userTier = user?.tier || 'FREE';

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [signals, setSignals] = useState<AlphaSignal[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-detect User Locale with Persistence
  useEffect(() => {
    const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
    if (savedLang) {
      setLang(savedLang);
    } else {
      const userLang = navigator.language || navigator.languages[0];
      if (userLang.startsWith('ko')) {
        setLang('ko');
      } else {
        setLang('ko'); // Default to Korean
      }
    }
  }, []);

  const handleSetLang = (newLang: 'ko' | 'en') => {
    setLang(newLang);
    localStorage.setItem('stock-empire-lang', newLang);
  };

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch(`/api/alpha-signals?lang=${lang}&t=${Number(new Date())}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSignals(data);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch alpha signals", e);
      }
    };
    fetchSignals();

    // 실시간화: 30초마다 알파 시그널 동기화
    const interval = setInterval(fetchSignals, 30000);
    return () => clearInterval(interval);
  }, [lang]);

  const openPayment = (plan: string) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  const handleUpgradeComplete = () => {
    updateTier(selectedPlan as 'PRO');
  };

  return (
    <div className={`min-h-screen pb-20 bg-[#050b14] text-[#e2e8f0] ${lang === 'ko' ? 'font-sans' : 'font-sans'}`}>
      <Ticker />
      <SiteHeader lang={lang} setLang={handleSetLang} />

      {/* HERO SECTION WITH EVENT BANNER */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        {/* EVENT BANNER */}
        <div className="absolute top-0 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 py-2 text-center z-50 animate-pulse">
          <span className="text-white text-xs md:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            {lang === 'ko' ? "🎉 GRAND OPEN: 2월 한달간 PRO 전 기능 무료! (결제는 3월 1일부터)" : "🎉 GRAND OPEN: FREE PRO ACCESS until Feb 28! (Billing starts Mar 1)"}
          </span>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-radial from-indigo-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-[10px] font-black tracking-widest uppercase text-indigo-400 mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3" /> {t.common.statusOnline}
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-8 leading-[0.9] text-white">
            {lang === 'ko' ? (
              <>
                <span className="text-indigo-400">데이터</span>로 증명하는 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-600">ALPHA EMPIRE</span>
              </>
            ) : (
              <>
                UNLEASH THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-600">ALPHA EMPIRE</span>
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/news" className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group">
              {t.hero.cta} <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRO Alpha Insights Section */}
      <section className="max-w-7xl mx-auto px-8 -mt-20 relative z-20">
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative group">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{t.proZone.title}</h2>
            <Link href="/live-alpha" className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-300">
              {t.common.more} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {signals.slice(0, 4).map((sig, idx) => (
                <div key={idx} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/50 transition-all group/card relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-black text-white">{sig.ticker}</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`flex items-center gap-1 text-[10px] font-black ${sig.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                        {sig.sentiment === 'BULLISH' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {sig.change_pct}%
                      </span>
                      <span className="text-[9px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {lang === 'ko' ? '기관 분석 중' : 'INSTITUTIONAL'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight relative z-10">{sig.name}</h3>

                  <div className="mb-6 relative z-10">
                    <div className="flex justify-between text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">
                      <span>{lang === 'ko' ? 'AI 신뢰도' : 'AI Confidence'}</span>
                      <span className="text-indigo-400">{sig.impact_score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${sig.impact_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.proZone.targetPrice}</span>
                      <div className={`text-lg font-black font-mono transition-all ${userTier === 'FREE' ? 'blur-md select-none text-slate-600' : 'text-green-400'}`}>
                        ${sig.target_price}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.proZone.stopPrice}</span>
                      <div className={`text-lg font-black font-mono transition-all ${userTier === 'FREE' ? 'blur-md select-none text-slate-600' : 'text-red-400'}`}>
                        ${sig.stop_loss}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">{t.proZone.aiRationale}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed text-slate-300 ${userTier === 'FREE' ? 'blur-[5px] line-clamp-2 select-none' : 'line-clamp-2'}`}>
                      {sig.ai_reason}
                    </p>
                    {userTier === 'FREE' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                        <Lock className="w-5 h-5 text-indigo-500/50" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {userTier === 'FREE' && (
            <div className="mt-12 pt-12 border-t border-slate-800/50 text-center animate-pulse">
              <button
                onClick={() => openPayment('PRO')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all font-black"
              >
                {t.proZone.unlockPicks} <Lock size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sector Intelligence Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{lang === 'ko' ? '데이터 허브' : 'DATA HUB'}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
              Sector <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Intelligence</span>
            </h2>
          </div>
          <Link href="/themes" className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-300">
            {lang === 'ko' ? '모든 테마 보기' : 'VIEW ALL THEMES'} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              id: 'ai-revolution',
              name: lang === 'ko' ? 'AI 혁명' : 'AI Revolution',
              icon: Cpu,
              color: 'from-purple-600/20 to-indigo-600/5',
              preview: ['NVDA', 'MSFT', 'PLTR']
            },
            {
              id: 'ev-energy',
              name: lang === 'ko' ? 'EV & 클린 에너지' : 'EV & Clean Energy',
              icon: Zap,
              color: 'from-green-600/20 to-emerald-600/5',
              preview: ['TSLA', 'RIVN', 'ENPH']
            },
            {
              id: 'semiconductors',
              name: lang === 'ko' ? '반도체 가이츠' : 'Semiconductor',
              icon: ActivityIcon,
              color: 'from-blue-600/20 to-cyan-600/5',
              preview: ['NVDA', 'AMD', 'AVGO']
            },
            {
              id: 'fintech-crypto',
              name: lang === 'ko' ? '핀테크 & 크립토' : 'Fintech & Crypto',
              icon: Milestone,
              color: 'from-orange-600/20 to-amber-600/5',
              preview: ['COIN', 'PYPL', 'SQ']
            }
          ].map((theme, i) => (
            <Link
              key={i}
              href={`/themes?id=${theme.id}`}
              className={`group p-8 rounded-[2rem] bg-gradient-to-br ${theme.color} border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all relative overflow-hidden flex flex-col h-full`}
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500"></div>

              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform duration-500">
                  <theme.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1.5 translate-y-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-green-400 transition-colors">
                    {lang === 'ko' ? '실시간 스캔 중' : 'Live Scan'}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                  {theme.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {theme.preview.map(ticker => (
                    <span key={ticker} className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded group-hover:border-slate-700 transition-colors text-[9px] font-black text-slate-400">
                      {ticker}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-all">
                {lang === 'ko' ? '섹터 정밀 분석' : 'SECTOR INSPECTION'} <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* News Teaser Section */}
      <NewsTeaser lang={lang} openPayment={openPayment} />

      {/* Stats Summary Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center uppercase">
          <div>
            <div className="text-4xl font-black text-white mb-2 tracking-tighter">94.2%</div>
            <div className="text-[10px] font-black text-slate-500 tracking-widest italic">{t.stats.activeBots} {t.dashboard.performanceRecord}</div>
          </div>
          <div className="border-x border-slate-800">
            <div className="text-4xl font-black text-indigo-400 mb-2 tracking-tighter">1.2M+</div>
            <div className="text-[10px] font-black text-slate-500 tracking-widest italic">{t.stats.newsCount}</div>
          </div>
          <div>
            <div className="text-4xl font-black text-green-500 mb-2 tracking-tighter">₩4.2B+</div>
            <div className="text-[10px] font-black text-slate-500 tracking-widest italic">{t.stats.revenue}</div>
          </div>
        </div>
        <AdLeaderboard />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-white uppercase underline decoration-indigo-500 underline-offset-8">{t.pricing.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          {/* FREE PLAN */}
          <div className="p-10 rounded-[2rem] border border-slate-800 bg-slate-900/20 flex flex-col hover:border-slate-700 transition-all">
            <span className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">{t.pricing.entry}</span>
            <div className="text-4xl font-black text-white mb-6 tracking-tighter">{t.pricing.free_price}</div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase italic"><ActivityIcon className="w-4 h-4 text-slate-700" /> {t.pricing.features.news}</li>
              <li className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase italic"><ActivityIcon className="w-4 h-4 text-slate-700" /> {t.pricing.features.delayed_charts}</li>
            </ul>
            {userTier === 'FREE' ? (
              <button className="w-full py-4 rounded-xl border border-slate-700 text-[10px] font-black uppercase text-slate-500 cursor-default">{t.pricing.current_tier}</button>
            ) : (
              <button className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-slate-300">Downgrade</button>
            )}
          </div>

          {/* PRO PLAN (Unified) */}
          <div className="p-10 rounded-[2rem] border-2 border-indigo-500 bg-gradient-to-br from-indigo-950/20 to-slate-900/40 flex flex-col relative group hover:border-indigo-400 transition-all shadow-2xl shadow-indigo-900/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{t.pricing.top_choice}</div>
            <span className="text-[10px] text-indigo-400 uppercase font-black mb-2 tracking-widest">{t.pricing.pro}</span>
            <div className="text-4xl font-black text-white mb-2 tracking-tighter">{t.pricing.pro_price}</div>
            <div className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-wide">{t.pricing.pro_price_yearly}</div>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-white font-black uppercase italic tracking-tighter"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> {t.pricing.features.unlimited_news}</li>
              <li className="flex items-center gap-2 text-xs text-white font-black uppercase italic tracking-tighter"><Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {t.pricing.features.standard_signals}</li>
              <li className="flex items-center gap-2 text-xs text-white font-black uppercase italic tracking-tighter"><Crown className="w-4 h-4 text-indigo-500 fill-indigo-500" /> {t.pricing.features.alpha_picks}</li>
              <li className="flex items-center gap-2 text-xs text-white font-black uppercase italic tracking-tighter"><Lock className="w-4 h-4 text-indigo-500" /> {t.pricing.features.full_access}</li>
            </ul>

            {userTier === 'PRO' ? (
              <button className="w-full py-4 rounded-xl border border-indigo-500 text-[10px] font-black uppercase text-indigo-400 cursor-default">{t.pricing.current_tier}</button>
            ) : (
              <button onClick={() => openPayment('PRO')} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2">
                {t.pricing.upgrade_pro} <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#020617] py-20 text-center animate-fade-in relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-6 mb-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded bg-slate-900/50">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-bold text-slate-400">Secured by SSL</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded bg-slate-900/50">
              <Lock className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold text-slate-400">256-bit Encryption</span>
            </div>
          </div>

          <div className="flex justify-center gap-8 mb-8 text-slate-600">
            <BookOpen className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
            <MessageSquare className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
            <Award className="w-5 h-5 hover:text-indigo-400 cursor-pointer transition-colors" />
          </div>

          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-8">
            &copy; 2026 STOCK EMPIRE INC. {lang === 'ko' ? '글로벌 금융 혁신' : 'Global Financial Innovation'}.
          </p>

          <div className="max-w-3xl mx-auto border-t border-slate-900 pt-8">
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium text-balance">
              {lang === 'ko'
                ? "본 서비스는 투자 자문·권유가 아닌 정보 제공 목적이며, 모든 투자 결정 및 손실의 책임은 이용자 본인에게 있습니다. 과거 성과는 미래 수익을 보장하지 않습니다. STOCK EMPIRE는 제공된 정보의 무결성을 보장하지 않으며, 시스템 오류나 지연으로 인한 손실에 대해 책임을 지지 않습니다."
                : "This service is for informational purposes only and does not constitute investment advice or solicitation. All investment decisions and losses are the sole responsibility of the user. Past performance does not guarantee future results."}
            </p>
          </div>
        </div>
      </footer>

      <PaymentModal isOpen={isPaymentOpen} onClose={() => { setIsPaymentOpen(false); setSelectedPlan(""); }} plan={selectedPlan} onComplete={handleUpgradeComplete} lang={lang} />
      <QuizWidget />
    </div>
  );
}
