"use client";

import {
  Globe, Zap, ArrowUpRight, Play, UserPlus,
  ChevronRight, TrendingUp, Database, Cpu,
  Activity, BarChart3, Users, Flame, Clock, ShieldAlert,
  ChevronDown, Sparkles, BookOpen, ExternalLink,
  Milestone, BarChart, PieChart as PieChartIcon, MonitorSmartphone,
  Briefcase, MessageSquare, Lock, Target,
  CheckCircle2, Crown, X, CreditCard, Loader2, TrendingDown, Award
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { translations } from "@/lib/translations";
import { Ticker } from "@/components/Ticker";
import { QuizWidget } from "@/components/QuizWidget";

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
function PaymentModal({ isOpen, onClose, plan, onComplete }: { isOpen: boolean; onClose: () => void; plan: string; onComplete: () => void }) {
  const [step, setStep] = useState<'CARD' | 'PROCESSING' | 'SUCCESS'>('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

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
      alert("카드 정보를 모두 입력해주세요. (테스트용: 아무 숫자나 입력)");
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
            <h3 className="text-xl font-black text-white italic">SECURE CHECKOUT</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Selected Plan: <span className="text-blue-400">{plan}</span>
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
                  <span className="text-xs font-mono text-slate-400">DEBIT / CREDIT</span>
                </div>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="w-full bg-transparent text-2xl font-mono text-white placeholder-slate-600 focus:outline-none mb-4 tracking-wider"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <div className="flex justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Card Holder</div>
                    <div className="text-sm font-bold text-slate-300">INVESTOR</div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Expires</div>
                      <input type="text" placeholder="MM/YY" maxLength={5} className="w-16 bg-transparent text-sm font-bold text-white placeholder-slate-600 focus:outline-none" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">CVC</div>
                      <input type="text" placeholder="123" maxLength={3} className="w-10 bg-transparent text-sm font-bold text-white placeholder-slate-600 focus:outline-none" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={handlePay} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Pay Now
              </button>
            </div>
          )}
          {step === 'PROCESSING' && (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Processing Payment...</h3>
            </div>
          )}
          {step === 'SUCCESS' && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Upgrade Complete!</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN HOME PAGE ---
export default function Home() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const t = translations[lang];
  const [userTier, setUserTier] = useState<"FREE" | "VIP" | "VVIP">("FREE");
  const [alphaSignals, setAlphaSignals] = useState<AlphaSignal[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'VIP' | 'VVIP' | ''>('');

  const openPayment = (plan: 'VIP' | 'VVIP') => {
    setSelectedPlan(plan);
    setIsPaymentOpen(true);
  };

  const handleUpgradeComplete = () => {
    setUserTier(selectedPlan as any);
    try {
      localStorage.setItem('stock-empire-tier', selectedPlan);
    } catch (e) { }
  };

  useEffect(() => {
    // 1. Load Tier from LocalStorage
    const savedTier = localStorage.getItem('stock-empire-tier');
    if (savedTier) setUserTier(savedTier as any);

    // 2. Fetch Alpha Signals
    const fetchAlpha = async () => {
      try {
        const res = await fetch(`/alpha-signals.json?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setAlphaSignals(data);
        }
      } catch (e) { console.error(e); }
    };
    fetchAlpha();
  }, []);

  return (
    <div className={`min-h-screen pb-20 bg-[#050b14] text-[#e2e8f0] ${lang === 'ko' ? 'font-sans' : ''}`}>
      <div className="fixed top-0 left-0 w-full z-[60]">
        <Ticker />
      </div>

      <nav className="sticky top-14 z-50 bg-[#050b14]/80 backdrop-blur-xl border-b border-slate-800/60 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            <Globe className="w-8 h-8 text-[#d4af37]" /> Stock Empire
          </h1>
          <div className="hidden md:flex gap-8 text-[11px] font-bold text-slate-400 tracking-widest uppercase">
            <Link href="/dashboard" className="hover:text-white transition-colors">{t.nav.dashboard}</Link>
            <Link href="/news" className="hover:text-white transition-colors">{t.nav.news}</Link>
            <Link href="/analysis" className="hover:text-blue-400 transition-colors">{t.nav.analysis}</Link>
            <Link href="/market" className="hover:text-red-500 transition-colors font-black">{t.nav.market}</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userTier !== 'FREE' && (
            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${userTier === 'VVIP' ? 'bg-yellow-500 text-slate-900 border border-yellow-400' : 'bg-blue-600 text-white'}`}>
              {userTier === 'VVIP' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />} {userTier}
            </span>
          )}
          <button onClick={() => setLang(prev => prev === 'ko' ? 'en' : 'ko')} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all text-sm font-bold">
            <span>{lang === 'ko' ? '🇰🇷 KO' : '🇺🇸 EN'}</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700 mb-8">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Access Top 1% Investment Insights</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 leading-[1.1] bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          {lang === 'ko' ? (<>데이터로 증명하는<br /><span className="block mt-2 font-black italic">1%의 투자 위너</span></>) : t.hero.title}
        </h1>
        <p className="text-xl text-slate-400 font-medium max-w-3xl mx-auto mb-12">
          {t.hero.subtitle}
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-black text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3">
            {t.hero.cta} <ArrowUpRight className="w-6 h-6" />
          </Link>
          <button className="px-8 py-4 bg-slate-900/50 text-white rounded-xl font-bold text-lg border border-slate-700">
            <Play className="w-5 h-5 fill-current inline mr-2" /> {t.hero.watchDemo}
          </button>
        </div>
      </section>

      {/* --- VVIP ALPHA CHOICE SECTION (REAL-TIME) --- */}
      <section className="py-24 px-8 max-w-7xl mx-auto border-t border-slate-800/50">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500/10 p-2 rounded-lg"><Crown className="w-6 h-6 text-yellow-500" /></div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">VVIP 알파의 선택</h2>
            </div>
            <p className="text-slate-400 font-bold">상위 1% 투자자만을 위한 실시간 고확신 셋업 (Live Data)</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
            <button
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${userTier === 'VVIP' ? 'bg-yellow-500 text-slate-900' : 'text-slate-500 hover:text-white'}`}
              onClick={() => setUserTier('VVIP')}
            >
              VVIP 시점
            </button>
            <button
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${userTier !== 'VVIP' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
              onClick={() => setUserTier('FREE')}
            >
              일반인 시점
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {alphaSignals.slice(0, 3).map((stock, idx) => (
            <div key={idx} className="relative group perspective-1000">
              <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-yellow-500/50 group-hover:shadow-yellow-500/10">

                {/* Sentiment Header */}
                <div className={`flex justify-between items-center p-4 border-b border-slate-800/50 ${stock.sentiment === 'BULLISH' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stock.name}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${stock.sentiment === 'BULLISH' ? 'bg-green-500 text-green-950' : 'bg-red-500 text-red-950'}`}>
                    {stock.sentiment === 'BULLISH' ? 'BUY' : 'SELL RISK'} | {stock.impact_score}%
                  </span>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="text-xs font-bold text-slate-500 border border-slate-800 px-2 py-0.5 rounded inline-block mb-1">{stock.ticker}</div>
                      <h3 className="text-3xl font-black text-white">{stock.ticker}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-500 mb-1">Live Price</div>
                      <div className="text-2xl font-black text-white">${stock.price}</div>
                      <div className={`text-xs font-black ${stock.change_pct > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change_pct > 0 ? '+' : ''}{stock.change_pct}%
                      </div>
                    </div>
                  </div>

                  {/* Target / Stop Loss (VVIP Locked) */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 relative overflow-hidden group/target">
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1 block">Target</span>
                      <div className={`text-xl font-black text-green-400 ${userTier !== 'VVIP' ? 'filter blur-[8px]' : ''}`}>
                        ${stock.target_price}
                      </div>
                      {userTier !== 'VVIP' && <div className="absolute inset-0 flex items-center justify-center"><Lock className="w-4 h-4 text-slate-600" /></div>}
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 relative overflow-hidden group/stop">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 block">Stop Loss</span>
                      <div className={`text-xl font-black text-red-400 ${userTier !== 'VVIP' ? 'filter blur-[8px]' : ''}`}>
                        ${stock.stop_loss}
                      </div>
                      {userTier !== 'VVIP' && <div className="absolute inset-0 flex items-center justify-center"><Lock className="w-4 h-4 text-slate-600" /></div>}
                    </div>
                  </div>

                  {/* AI Reasoning (VVIP Locked) */}
                  <div className="relative">
                    <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Zap className="w-3 h-3 fill-yellow-500" /> AI 분석 근거
                    </h4>
                    <p className={`text-xs font-medium text-slate-400 leading-relaxed min-h-[60px] ${userTier !== 'VVIP' ? 'filter blur-[6px] select-none' : ''}`}>
                      {stock.ai_reason}
                    </p>
                    {userTier !== 'VVIP' && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-500/50" />
                        <button
                          onClick={() => openPayment('VVIP')}
                          className="px-4 py-1.5 bg-yellow-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-900/20 hover:bg-yellow-500 transition-colors"
                        >
                          Unlock VVIP Signal
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Real-time Engine Active</span>
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono italic">Update: {new Date(stock.updated_at).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-[10px] text-slate-600 font-bold max-w-2xl mx-auto flex items-start gap-2 justify-center">
          <ShieldAlert className="w-4 h-4 text-slate-700 flex-shrink-0" />
          <p>DISCLAIMER: 본 서비스에서 제공하는 모든 AI 분석 정보는 투자 판단을 위한 참고 자료일 뿐이며, 투자 결과에 대한 법적 책임은 사용자 본인에게 있습니다.</p>
        </div>
      </section>

      {/* Stats Summary Section */}
      <section className="relative -mt-20 z-10 px-4 max-w-7xl mx-auto">
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-4">
              <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Market Sentiment</h3>
              <div className="text-4xl font-black text-green-500">78</div>
              <span className="text-[10px] font-bold text-green-400 mt-2">EXTREME GREED</span>
            </div>
            <div className="p-4 border-x border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs">AI Daily Briefing</h3>
              </div>
              <p className="text-sm font-bold text-slate-300">"연준의 금리 동결 가능성이 커지면서 기술주의 매수 모멘텀이 강화되고 있습니다. AI 핵심주 중심의 비중 확대 전략이 유효합니다."</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-black">AI Accuracy</span>
                <div className="text-lg font-black text-green-500">94.2%</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-black">Active Nodes</span>
                <div className="text-lg font-black text-blue-500">128</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-white uppercase">Choose Your Agent</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* FREE PLAN */}
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Starter</span>
            <div className="text-4xl font-black text-white mb-6">₩0 <span className="text-sm font-medium text-slate-600">/ mo</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-600" /> 뉴스 요약 (일 3회)</li>
              <li className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="w-4 h-4 text-slate-600" /> 기본 시세 확인</li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-slate-700 text-xs font-black uppercase text-slate-400 hover:bg-slate-800 transition-all">Current Plan</button>
          </div>
          {/* VIP PLAN */}
          <div className="p-8 rounded-3xl border border-blue-500/50 bg-blue-900/10 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4"><Zap className="w-4 h-4 text-blue-500 fill-blue-500" /></div>
            <span className="text-[10px] text-blue-400 uppercase font-black mb-2 tracking-widest">VIP Trader</span>
            <div className="text-4xl font-black text-white mb-6">₩19,900 <span className="text-sm font-medium text-slate-600">/ mo</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-slate-200"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 무제한 실시간 분석</li>
              <li className="flex items-center gap-2 text-xs text-slate-200"><CheckCircle2 className="w-4 h-4 text-blue-500" /> AI 매매 시그널</li>
            </ul>
            <button onClick={() => openPayment('VIP')} className="w-full py-3 rounded-xl bg-blue-600 text-xs font-black uppercase text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">Upgrade Now</button>
          </div>
          {/* VVIP PLAN */}
          <div className="p-8 rounded-3xl border border-yellow-500 bg-gradient-to-br from-yellow-900/20 to-slate-900/60 flex flex-col relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Recommended</div>
            <span className="text-[10px] text-yellow-500 uppercase font-black mb-2 tracking-widest">VVIP Alpha</span>
            <div className="text-4xl font-black text-white mb-6">₩49,900 <span className="text-sm font-medium text-slate-600">/ mo</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-2 text-xs text-white font-bold"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> 실시간 알파 픽 (Real-time)</li>
              <li className="flex items-center gap-2 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> 목표가/손절가 완전 공개</li>
              <li className="flex items-center gap-2 text-xs text-white"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> 1:1 AI 포트폴리오 진단</li>
            </ul>
            <button onClick={() => openPayment('VVIP')} className="w-full py-3 rounded-xl bg-yellow-500 text-xs font-black uppercase text-slate-900 hover:bg-yellow-400 transition-all font-black">Join Alpha Club</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
        &copy; 2026 STOCK EMPIRE. Built for the top 1%.
      </footer>

      {/* Modals & Ticker components */}
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} plan={selectedPlan} onComplete={handleUpgradeComplete} />
      <QuizWidget />
    </div>
  );
}
