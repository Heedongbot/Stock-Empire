'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpRight, Sparkles, ChevronRight,
  TrendingUp, TrendingDown, Cpu, Zap, Lock,
  ShieldCheck, CheckCircle2, Activity as ActivityIcon,
  BookOpen, MessageSquare, Award, Loader2, Milestone, Database
} from 'lucide-react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { Ticker } from '@/components/TickerMain';
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import { QuizWidget } from '@/components/QuizMain';
import { translations } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';
import NewsTeaser from '@/components/NewsTeaser';
import AdInFeed from '@/components/ads/AdInFeed';

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
  const lang = 'ko'; // 한국어 전용 테스트
  const t = translations[lang];
  const { user } = useAuth();

  const [signals, setSignals] = useState<AlphaSignal[]>([]);
  const [loading, setLoading] = useState(true);

  // 알파 시그널 페칭 (Admin 전용으로 내부 필터링은 API에서도 하겠지만 UI에서도 처리)
  useEffect(() => {
    const fetchSignals = async () => {
      if (user?.role !== 'ADMIN') {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/alpha-signals?lang=${lang}&t=${Number(new Date())}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSignals(data);
        }
      } catch (e) {
        console.error("Failed to fetch alpha signals", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSignals();
  }, [user]);

  return (
    <div className="min-h-screen pb-20 bg-[#050b14] text-[#e2e8f0] font-sans">
      <Ticker />
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        {/* EVENT BANNER: 전면 무료화 공지 */}


        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-radial from-[#00ffbd]/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-[10px] font-black tracking-widest uppercase text-[#00ffbd] mb-8 animate-fade-in">
            <ActivityIcon className="w-3 h-3" /> {t.stats.statusOnline}
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-8 leading-[0.9] text-white">
            <span className="text-[#00ffbd]">데이터</span>로 증명하는 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffbd] via-blue-400 to-indigo-600">ALPHA EMPIRE</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
            365일 24시간, 보스님이 잠든 사이에도 AI는 전 세계 시장을 분석하여 리포트를 발행합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/newsroom" className="px-10 py-5 bg-[#00ffbd] hover:bg-[#00d4ff] rounded-2xl text-sm font-black uppercase tracking-widest text-black transition-all shadow-xl shadow-[#00ffbd]/20 flex items-center justify-center gap-3 group">
              터미널 입장 <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 💰 중간 광고 배치 */}
      <div className="max-w-7xl mx-auto px-8 mb-20">
        <AdLeaderboard />
      </div>

      {/* Alpha Insights Section: 오직 ADMIN(보스님)만 볼 수 있게 제한 */}
      {user?.role === 'ADMIN' ? (
        <section className="max-w-7xl mx-auto px-8 -mt-20 relative z-20 mb-20">
          <div className="bg-slate-900/50 backdrop-blur-3xl border border-[#00ffbd]/30 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#00ffbd]/10 rounded-full blur-[80px]" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#00ffbd]" />
                  고위험 알파 시그널 (사령관 전용)
                </h2>
                <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">이 섹션은 보스님(ADMIN) 외에 일반 사용자에게는 노출되지 않습니다.</p>
              </div>
              <Link href="/vvip-alpha" className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-[#00ffbd]/50 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#00ffbd]">
                상세 통제실 입장 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#00ffbd] animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {signals.slice(0, 4).map((sig, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl hover:border-[#00ffbd]/50 transition-all group/card relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-black text-white">{sig.ticker}</span>
                      <span className={`text-[10px] font-black ${sig.sentiment === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>
                        {sig.change_pct}%
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight">{sig.name}</h3>
                    <div className="space-y-4 mb-6 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500 uppercase">Target</span>
                        <span className="text-green-400 font-black">${sig.target_price}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500 uppercase">Stop</span>
                        <span className="text-red-400 font-black">${sig.stop_loss}</span>
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-3 italic">
                      {sig.ai_reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* 일반 사용자용: 리스크 방지를 위해 섹터 대시보드만 노출 */
        <section className="max-w-7xl mx-auto px-8 -mt-20 relative z-20 mb-20">
          <div className="bg-[#0c121d] border border-slate-800 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Database className="w-40 h-40" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">전 세계 투자 지능은 지금도 동기화 중</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 font-medium">실시간 뉴스룸과 테마 분석을 통해 시장의 거대한 흐름을 확인하세요. 알파 시그널은 안정성 검증 후 차례로 개방됩니다.</p>
            <Link href="/newsroom" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              뉴스룸 바로가기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Sector Intelligence Section */}
      <section className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-[#00ffbd]" />
              <span className="text-xs font-black text-[#00ffbd] uppercase tracking-widest">DATA HUB</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
              Sector <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#00ffbd]">Intelligence</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'ai-revolution', name: 'AI 혁명', icon: Cpu, color: 'from-purple-600/20 to-indigo-600/5', tickers: ['NVDA', 'MSFT', 'PLTR'] },
            { id: 'ev-energy', name: 'EV & 클린 에너지', icon: Zap, color: 'from-green-600/20 to-emerald-600/5', tickers: ['TSLA', 'RIVN', 'ENPH'] },
            { id: 'semiconductors', name: '반도체 가이츠', icon: ActivityIcon, color: 'from-blue-600/20 to-cyan-600/5', tickers: ['NVDA', 'AMD', 'AVGO'] },
            { id: 'fintech-crypto', name: '핀테크 & 크립토', icon: Milestone, color: 'from-orange-600/20 to-amber-600/5', tickers: ['COIN', 'PYPL', 'SQ'] }
          ].map((theme, i) => (
            <Link
              key={i}
              href={`/themes?id=${theme.id}`}
              className={`group p-8 rounded-[2rem] bg-gradient-to-br ${theme.color} border border-slate-800 hover:border-[#00ffbd]/50 transition-all flex flex-col h-full`}
            >
              <theme.icon className="w-8 h-8 text-white mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black text-white uppercase italic mb-4 group-hover:text-[#00ffbd]">{theme.name}</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {theme.tickers.map(t => <span key={t} className="text-[9px] font-black text-slate-500">{t}</span>)}
              </div>
              <div className="mt-auto text-[10px] font-black text-slate-500 uppercase group-hover:text-white transition-colors">분석 리포트 보기 →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 💰 피드 중간 대형 광고 */}
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="text-center mb-6">
          <span className="text-[9px] font-bold text-slate-700 tracking-[0.4em] uppercase">Private Sponsor</span>
        </div>
        <AdInFeed />
      </div>

      <NewsTeaser lang={lang} openPayment={() => { }} />

      {/* Stats Summary Area */}
      <section className="py-24 px-8 max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div><div className="text-5xl font-black text-[#00ffbd] mb-2 tracking-tighter">94.2%</div><div className="text-[10px] font-black text-slate-600 tracking-widest uppercase">AI 실시간 적중률</div></div>
          <div><div className="text-5xl font-black text-blue-500 mb-2 tracking-tighter">1.2M+</div><div className="text-[10px] font-black text-slate-600 tracking-widest uppercase">분석된 글로벌 뉴스</div></div>
          <div><div className="text-5xl font-black text-white mb-2 tracking-tighter">₩4.2B+</div><div className="text-[10px] font-black text-slate-600 tracking-widest uppercase">처리된 데이터 자산</div></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#020617] py-20 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-8 mb-8 text-slate-700">
            <BookOpen className="w-5 h-5 hover:text-[#00ffbd] cursor-pointer" />
            <MessageSquare className="w-5 h-5 hover:text-[#00ffbd] cursor-pointer" />
            <Award className="w-5 h-5 hover:text-[#00ffbd] cursor-pointer" />
          </div>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-8">
            &copy; 2026 STOCK EMPIRE INC. KOREA ALPHA TEST VERSION.
          </p>
          <div className="max-w-3xl mx-auto border-t border-slate-900 pt-8 opacity-50">
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
              본 서비스는 투자 자문이 아닌 정보 제공 목적이며, 모든 리스크에 대한 책임은 이용자 본인에게 있습니다. 리스크가 높은 알파 시그널은 보스 전용 통제실에서만 관리됩니다.
            </p>
          </div>
        </div>
      </footer>

      <QuizWidget />
    </div>
  );
}
