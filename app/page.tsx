"use client";
// Vercel Build Trigger: v1.0.1

import {
  Globe, Zap, ArrowUpRight, UserPlus,
  ChevronRight, TrendingUp, Database, Cpu,
  Activity, BarChart3, Users, Flame, Clock, ShieldAlert,
  ChevronDown, Sparkles, BookOpen, ExternalLink,
  Milestone, BarChart, PieChart as PieChartIcon, MonitorSmartphone,
  Briefcase, MessageSquare, Lock, Target,
  CheckCircle2, Crown, X, CreditCard, Loader2, TrendingDown, Award, ShieldCheck
} from "lucide-react";
import NewsTeaser from "@/components/NewsTeaser";
import { useEffect, useState } from "react";
import Link from "next/link";
import { translations } from "@/lib/translations";
import { Ticker } from "@/components/Ticker";
import { QuizWidget } from "@/components/QuizWidget";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/lib/AuthContext";

// --- Interfaces for Alpha Signals ---
interface AlphaSignal {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change_pct: number;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  impact_score: number;
  target_price: number;
  stop_loss: number;
  ai_reason: string;
  updated_at: string;
}

// --- Payment Modal Component ---
function PaymentModal({ isOpen, onClose, plan, onComplete, lang }: { isOpen: boolean; onClose: () => void; plan: string; onComplete: () => void; lang: "ko" | "en" }) {
  const [step, setStep] = useState<'CARD' | 'PROCESSING' | 'SUCCESS'>('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const t = (translations as any)[lang];

  useEffect(() => {
    if (isOpen) {
      setStep('CARD');
      setCardNumber('');
      setExpiry('');
      setCvc('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    if (!cardNumber || !expiry || !cvc) {
      alert(t.payment.cardInfo + " " + t.payment.mockInfo);
      return;
    }
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white italic">{t.payment.checkout}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              {t.payment.selectedPlan}: <span className="text-blue-400">{plan}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8">
          {step === 'CARD' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CreditCard className="w-24 h-24 text-white" />
                </div>
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-8 bg-yellow-600/50 rounded flex items-center justify-center">
                    <div className="w-8 h-5 bg-yellow-400/50 rounded-sm"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{t.payment.cardLabel}</span>
                </div>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="w-full bg-transparent text-2xl font-mono text-white placeholder-slate-600 focus:outline-none mb-4 tracking-wider"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-1/2 bg-transparent text-lg font-mono text-white placeholder-slate-600 focus:outline-none tracking-widest"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    maxLength={3}
                    className="w-1/2 bg-transparent text-lg font-mono text-white placeholder-slate-600 text-right focus:outline-none tracking-widest"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handlePay}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {t.payment.complete}
              </button>
            </div>
          )}
          {step === 'PROCESSING' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
              <h4 className="text-xl font-black text-white uppercase italic tracking-widest">{t.payment.processing}</h4>
              <p className="text-slate-500 text-xs mt-2">{t.payment.processingDesc}</p>
            </div>
          )}
          {step === 'SUCCESS' && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h4 className="text-2xl font-black text-white uppercase italic tracking-widest">{t.payment.success}</h4>
              <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-tighter">{t.payment.successDesc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN LANDING PAGE ---
export default function LandingPage() {
  const [lang, setLang] = useState<"ko" | "en">("ko");
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
        // Default to Korean for this user even if browser is English, 
        // because the user seems to prefer it.
        setLang('ko');
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
        const res = await fetch(`/api/alpha-signals?lang=${lang}&t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setSignals(data);
        }
      } catch (e) {
        console.error("Failed to fetch alpha signals", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSignals();
  }, [lang]);

  const openPayment = (plan: string) => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  const handleUpgradeComplete = () => {
    updateTier(selectedPlan as 'VIP' | 'VVIP');
  };

  return (
    <div className={`min-h-screen pb-20 bg-[#050b14] text-[#e2e8f0] ${lang === 'ko' ? 'font-sans' : 'font-sans'}`}>
      <Ticker />
      <SiteHeader lang={lang} setLang={handleSetLang} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-radial from-indigo-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
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

      {/* VVIP Alpha Choice Section */}
      <section className="max-w-7xl mx-auto px-8 -mt-20 relative z-20">
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative group">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-black text-yellow-500 uppercase tracking-widest">{t.vvipZone.title}</span>
              </div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{t.analysis.allInsights}</h2>
            </div>
            <Link href="/analysis" className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-300">
              {t.common.more} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {signals.slice(0, 4).map((sig, idx) => (
                <div key={idx} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl hover:border-yellow-500/50 transition-all group/card relative overflow-hidden">
                  {/* Golden Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-black text-white">{sig.ticker}</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`flex items-center gap-1 text-[10px] font-black ${sig.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                        {sig.sentiment === 'BULLISH' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {sig.change_pct}%
                      </span>
                      {/* New Premium Badge */}
                      <span className="text-[9px] font-black text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                        WHALE ACTIVE
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight relative z-10">{sig.name}</h3>

                  {/* Confidence Score Bar */}
                  <div className="mb-6 relative z-10">
                    <div className="flex justify-between text-[9px] font-black text-slate-500 mb-1 uppercase tracking-widest">
                      <span>AI Confidence</span>
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
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.vvipZone.targetPrice}</span>
                      <div className={`text-lg font-black font-mono transition-all ${userTier === 'FREE' ? 'blur-md select-none text-slate-600' : 'text-green-400'}`}>
                        ${sig.target_price}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.vvipZone.stopPrice}</span>
                      <div className={`text-lg font-black font-mono transition-all ${userTier === 'FREE' ? 'blur-md select-none text-slate-600' : 'text-red-400'}`}>
                        ${sig.stop_loss}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">{t.vvipZone.aiRationale}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed text-slate-300 ${userTier === 'FREE' ? 'blur-[5px] line-clamp-2 select-none' : 'line-clamp-2'}`}>
                      {sig.ai_reason}
                    </p>
                    {userTier === 'FREE' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                        <Lock className="w-5 h-5 text-yellow-500/50" />
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
                onClick={() => openPayment('VVIP')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-yellow-500/20 transition-all font-black"
              >
                {t.vvipZone.unlockPicks} <Lock size={14} />
              </button>
            </div>
          )}
        </div>


        // ... existing code ...

        {/* VVIP Alpha Choice Section */}
        {/* ... existing VVIP section ... */}
      </section>

      {/* NEW: News Teaser Section */}
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
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-white uppercase underline decoration-indigo-500 underline-offset-8">{t.pricing.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* FREE PLAN */}
          <div className="p-8 rounded-[2rem] border border-slate-800 bg-slate-900/20 flex flex-col hover:border-slate-700 transition-all">
            <span className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">{t.pricing.entry}</span>
            <div className="text-4xl font-black text-white mb-6 tracking-tighter">{t.pricing.free_price}</div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase italic"><Activity className="w-4 h-4 text-slate-700" /> {t.pricing.features.news}</li>
              <li className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase italic"><Activity className="w-4 h-4 text-slate-700" /> {t.pricing.features.delayed_charts}</li>
            </ul>
            <button className="w-full py-4 rounded-xl border border-slate-700 text-[10px] font-black uppercase text-slate-500 cursor-default">{t.pricing.current_tier}</button>
          </div>

          {/* VIP PLAN */}
          <div className="p-8 rounded-[2rem] border border-blue-500/30 bg-blue-950/10 flex flex-col relative group hover:border-blue-500 transition-all">
            <div className="absolute top-6 right-8"><Zap className="w-5 h-5 text-blue-500 fill-blue-500" /></div>
            <span className="text-[10px] text-blue-500 uppercase font-black mb-2 tracking-widest">{t.pricing.vip}</span>
            <div className="text-4xl font-black text-white mb-6 tracking-tighter">{t.pricing.vip_price}</div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-200 font-bold uppercase italic"><CheckCircle2 className="w-4 h-4 text-blue-500" /> {t.pricing.features.unlimited_news}</li>
              <li className="flex items-center gap-2 text-xs text-slate-200 font-bold uppercase italic"><CheckCircle2 className="w-4 h-4 text-blue-500" /> {t.pricing.features.standard_signals}</li>
            </ul>
            <button onClick={() => openPayment('VIP')} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-blue-600/20">{t.pricing.upgrade_vip}</button>
          </div>

          {/* VVIP PLAN */}
          <div className="p-8 rounded-[2rem] border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-950/10 to-slate-900/40 flex flex-col relative group hover:border-yellow-500 transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">{t.pricing.top_choice}</div>
            <span className="text-[10px] text-yellow-500 uppercase font-black mb-2 tracking-widest">{t.pricing.vvip}</span>
            <div className="text-4xl font-black text-white mb-6 tracking-tighter">{t.pricing.vvip_price}</div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-white font-black uppercase italic tracking-tighter"><Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {t.pricing.features.alpha_picks}</li>
              <li className="flex items-center gap-2 text-xs text-white font-black uppercase italic tracking-tighter"><Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {t.pricing.features.insider_logic}</li>
              <li className="flex items-center gap-2 text-xs text-white font-black uppercase italic tracking-tighter"><Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {t.pricing.features.full_access}</li>
            </ul>
            <button onClick={() => openPayment('VVIP')} className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-[10px] font-black uppercase tracking-widest text-slate-950 transition-all shadow-xl shadow-yellow-500/30">{t.pricing.join_vvip}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#020617] py-20 text-center animate-fade-in relative z-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Security Badges */}
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

          {/* Legal Disclaimer */}
          <div className="max-w-3xl mx-auto border-t border-slate-900 pt-8">
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium text-balance">
              {lang === 'ko'
                ? "본 서비스는 투자 자문·권유가 아닌 정보 제공 목적이며, 모든 투자 결정 및 손실의 책임은 이용자 본인에게 있습니다. 과거 성과는 미래 수익을 보장하지 않습니다. STOCK EMPIRE는 제공된 정보의 무결성을 보장하지 않으며, 시스템 오류나 지연으로 인한 손실에 대해 책임을 지지 않습니다."
                : "This service is for informational purposes only and does not constitute investment advice or solicitation. All investment decisions and losses are the sole responsibility of the user. Past performance does not guarantee future results."}
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Ticker components */}
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} plan={selectedPlan} onComplete={handleUpgradeComplete} lang={lang} />
      <QuizWidget />
    </div>
  );
}
