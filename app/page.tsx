'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpRight, Sparkles, ChevronRight,
  TrendingUp, TrendingDown, Cpu, Zap, Lock, Search, RefreshCw,
  ShieldCheck, CheckCircle2, Activity as ActivityIcon,
  BookOpen, MessageSquare, Award, Loader2, Milestone, Database, FileText, X
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
import LatestNewsInsights from '@/components/LatestNewsInsights';
import SponsorshipSection from '@/components/SponsorshipSection';

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

  const [marketData, setMarketData] = useState<Record<string, { price: number; change: number }>>({});
  const [signals, setSignals] = useState<AlphaSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanning, setScanning] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  const handleDeepScan = async () => {
    if (!searchTerm) return;
    setScanning(true);
    try {
      const res = await fetch(`/api/analyze-ticker?ticker=${searchTerm}`);
      const contentType = res.headers.get("content-type");

      if (!res.ok || !contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Analysis API failed:", text);
        alert(`분석 에러 (${res.status}): API KEY 설정이 필요합니다.`);
        return;
      }

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      // 실시간 분석 결과 목록 처음에 추가 및 모달 자동 팝업
      setSignals(prev => [data, ...prev.filter(s => s.ticker !== data.ticker)]);
      setSelectedAnalysis(data);
    } catch (e) {
      console.error("Deep Scan failed", e);
      alert("연결 오류가 발생했습니다.");
    } finally {
      setScanning(false);
    }
  };

  const filteredSignals = searchTerm
    ? signals.filter(s => s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : signals.slice(0, 4);

  // Fetch Market Data for Sectors
  useEffect(() => {
    const fetchMarketData = async () => {
      const tickers = ['NVDA', 'MSFT', 'PLTR', 'TSLA', 'RIVN', 'ENPH', 'AMD', 'AVGO', 'INTC', 'COIN', 'PYPL', 'SQ'].join(',');
      try {
        const res = await fetch(`/api/stock-price?tickers=${tickers}`);
        if (res.ok) {
          const data = await res.json();
          setMarketData(data);
        }
      } catch (e) {
        console.error("Failed to fetch market data", e);
      }
    };
    fetchMarketData();
  }, []);

  // 알파 시그널 페칭 (전면 무료화에 따라 모든 유저에게 공개)
  useEffect(() => {
    const fetchSignals = async () => {
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
  }, [lang]);

  return (
    <div className="min-h-screen pb-20 bg-[#050b14] text-[#e2e8f0] font-sans">
      <Ticker />
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-40 overflow-hidden">
        {/* HERO BACKGROUND & CONTENT */}
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

      {/* 📰 투데이 마켓 브리핑 (최신 지표 및 뉴스) - 대체 배치 */}
      <LatestNewsInsights />

      {/* 💸 후원 및 스폰서십 섹션 */}
      <SponsorshipSection />

      {/* LIVE ALPHA SIGNALS (MAIN PAGE - FULL OPEN) */}
      <section className="max-w-7xl mx-auto px-8 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#00ffbd] fill-[#00ffbd]" />
              <span className="text-xs font-black text-[#00ffbd] uppercase tracking-widest">Live Alpha Signals</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
              Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffbd] to-blue-500">Breakthroughs</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto items-end">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder-slate-600 focus:border-[#00ffbd] transition-all"
                  placeholder="티커 검색 및 즉시 분석"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDeepScan()}
                />
              </div>
              <button
                onClick={handleDeepScan}
                disabled={scanning}
                className={`px-5 py-2.5 bg-slate-900 border border-slate-800 text-[#00ffbd] text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-[#00ffbd]/50 transition-all flex items-center gap-2 ${scanning ? 'animate-pulse' : ''}`}
              >
                {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {scanning ? 'Analyzing' : 'Deep Scan'}
              </button>
            </div>
            <Link href="/analysis" className="text-[10px] font-black text-slate-600 hover:text-[#00ffbd] uppercase tracking-widest flex items-center gap-2 transition-colors">
              전체 분석 보기 <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[300px] h-64 bg-slate-900/30 border border-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/20 border border-slate-800/50 rounded-[3rem]">
            <Search className="w-12 h-12 text-slate-800 mx-auto mb-6" />
            <h3 className="text-xl font-black text-white italic uppercase mb-4">No Signals Found</h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-md mx-auto mb-8">
              "{searchTerm}" 에 대한 로컬 분석 데이터가 없습니다. <br />
              상단의 <span className="text-[#00ffbd]">Deep Scan</span> 버튼을 눌러보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSignals.map((sig, idx) => (
              <div key={idx} className="group bg-[#0a1120] border border-slate-800 rounded-3xl p-6 hover:border-[#00ffbd]/50 transition-all shadow-xl relative overflow-hidden flex flex-col">
                {(sig as any).is_real_time && (
                  <div className="absolute top-0 left-0 px-3 py-1 bg-[#00ffbd] text-black text-[8px] font-black uppercase tracking-tighter rounded-br-lg z-10 animate-pulse">
                    Live Analyzed
                  </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-black text-white">{sig.ticker}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${sig.sentiment === 'BULLISH' ? 'text-[#00ffbd]' : 'text-[#ff4d4d]'}`}>
                    {sig.sentiment}
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase truncate">{sig.name}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Confidence</span>
                    <span className="text-[#00ffbd] font-black">{sig.impact_score}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                      <div className="text-[7px] text-slate-600 font-bold uppercase mb-0.5">Target</div>
                      <div className="text-sm font-black text-[#00ffbd] tracking-tighter">${sig.target_price}</div>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                      <div className="text-[7px] text-slate-600 font-bold uppercase mb-0.5">Stop Loss</div>
                      <div className="text-sm font-black text-red-500 tracking-tighter">${sig.stop_loss}</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded-2xl border border-slate-800/50 mb-6 flex-grow">
                  <p className="text-[10px] text-slate-400 leading-relaxed italic line-clamp-3">
                    "{sig.ai_reason}"
                  </p>
                </div>

                <button
                  onClick={() => setSelectedAnalysis(sig)}
                  className="w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#00ffbd] group-hover:border-[#00ffbd]/30 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Full AI Report
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
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
            { id: 'semiconductors', name: '반도체 가이츠', icon: ActivityIcon, color: 'from-blue-600/20 to-cyan-600/5', tickers: ['AMD', 'AVGO', 'INTC'] },
            { id: 'fintech-crypto', name: '핀테크 & 크립토', icon: Milestone, color: 'from-orange-600/20 to-amber-600/5', tickers: ['COIN', 'PYPL', 'SQ'] }
          ].map((theme, i) => (
            <Link
              key={i}
              href={`/themes?id=${theme.id}`}
              className={`group p-8 rounded-[2rem] bg-gradient-to-br ${theme.color} border border-slate-800 hover:border-[#00ffbd]/50 transition-all flex flex-col h-full`}
            >
              <theme.icon className="w-8 h-8 text-white mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-black text-white uppercase italic mb-4 group-hover:text-[#00ffbd]">{theme.name}</h3>

              <div className="space-y-3 mb-8">
                {theme.tickers.map(t => {
                  const data = marketData[t];
                  const isUp = data?.change >= 0;
                  return (
                    <div key={t} className="flex items-center justify-between text-xs bg-black/20 p-2 rounded-lg">
                      <span className="font-bold text-slate-300">{t}</span>
                      {data ? (
                        <div className={`flex items-center gap-1 font-black ${isUp ? 'text-[#00ffbd]' : 'text-[#ff4d4d]'}`}>
                          <span>{data.price.toFixed(2)}</span>
                          <span className="text-[10px] opacity-80">({data.change > 0 ? '+' : ''}{data.change.toFixed(2)}%)</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 animate-pulse">...</span>
                      )}
                    </div>
                  );
                })}
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
            &copy; 2026 STOCK EMPIRE INC. GLOBAL ALPHA TEST VERSION.
          </p>
          <div className="max-w-3xl mx-auto border-t border-slate-900 pt-8 opacity-50">
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
              본 서비스는 투자 자문이 아닌 정보 제공 목적이며, 모든 리스크에 대한 책임은 이용자 본인에게 있습니다. 리스크가 높은 알파 시그널은 보스 전용 통제실에서만 관리됩니다.
            </p>
          </div>
        </div>
      </footer>

      <QuizWidget />

      {/* Analysis Details Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedAnalysis(null)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a1120] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-zoom-in">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00ffbd]/10 rounded-2xl border border-[#00ffbd]/30">
                  <ShieldCheck className="w-8 h-8 text-[#00ffbd]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedAnalysis.name} ({selectedAnalysis.ticker})</h2>
                  <p className="text-[10px] font-black text-[#00ffbd] uppercase tracking-[0.3em]">Deep Analysis via NotebookLM Intelligent Engine</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Technical Analysis</div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {selectedAnalysis.technical_analysis || "기술적 지표 분석 데이터가 없습니다."}
                  </p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Fundamental Analysis</div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {selectedAnalysis.fundamental_analysis || "기본적 분석 데이터가 없습니다."}
                  </p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 border-[#00ffbd]/30 shadow-lg shadow-[#00ffbd]/5">
                  <div className="text-[10px] font-black text-[#00ffbd] uppercase mb-2 italic">Master's Action Plan</div>
                  <p className="text-sm text-white leading-relaxed font-bold">
                    {selectedAnalysis.action_plan || "대응 계획 데이터가 없습니다."}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#00ffbd]/5 rounded-3xl border border-[#00ffbd]/20">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-[#00ffbd]" />
                  <span className="text-xs font-black text-[#00ffbd] uppercase tracking-widest">AI Strategic Summary</span>
                </div>
                <p className="text-lg font-black text-white italic leading-snug">
                  "{selectedAnalysis.ai_reason}"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-900/30 border-t border-slate-800 flex justify-center">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                본 리포트는 NotebookLM에 의해 생성된 마스터 지능형 포트폴리오 전략입니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
