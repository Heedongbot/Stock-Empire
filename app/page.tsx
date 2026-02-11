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
import AdLeaderboard from '@/components/ads/AdLeaderboard';
import { translations } from '@/lib/translations';
import { useAuth } from '@/lib/AuthContext';
import AdInFeed from '@/components/ads/AdInFeed';
import LatestNewsInsights from '@/components/LatestNewsInsights';
import StockLogo from '@/components/StockLogo';
import FriendlyPrice from '@/components/FriendlyPrice';
import { STOCK_LIST } from '@/lib/stocks';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filteredSuggestions = searchTerm.trim()
    ? STOCK_LIST.filter(s =>
      s.name.includes(searchTerm) ||
      s.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
    : [];
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [exchangeRate, setExchangeRate] = useState(1435); // 초기값 실시간 근접 업데이트

  useEffect(() => {
    fetch('/api/exchange-rate')
      .then(res => res.json())
      .then(data => {
        if (data.rate) setExchangeRate(data.rate);
      })
      .catch(err => console.error('Failed to load exchange rate:', err));
  }, []);

  const handleDeepScan = async () => {
    if (!searchTerm) return;
    setIsSearching(true); // Changed from setScanning to setIsSearching
    setShowSuggestions(false); // Hide suggestions after initiating scan
    try {
      const res = await fetch(`/api/analyze-ticker?ticker=${searchTerm}`);
      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 실시간 분석 결과 목록 처음에 추가 및 모달 자동 팝업
      setSignals(prev => [data, ...prev.filter(s => s.ticker !== data.ticker)]);
      setSelectedAnalysis(data);
    } catch (err: any) {
      console.error("Deep Scan failed", err);
      alert(err.message || "연결 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
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
    <div className="min-h-screen pb-20 bg-background text-foreground font-sans">
      <SiteHeader />

      {/* HERO SECTION - Friendly & Simple */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-[10px] font-black tracking-widest uppercase text-blue-600 mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" /> 해외주식, 이제 어렵지 않아요!
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-8 md:mb-10 leading-tight text-slate-900">
            주식 공부 대신 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Stock Empire</span>에서 <br />
            쉽게 물어보세요
          </h1>

          {/* Google-style Central Search */}
          <div className="max-w-2xl mx-auto mb-10 md:mb-12 relative group">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleDeepScan()}
                placeholder="애플, 테슬라, 엔비디아..."
                className="w-full px-6 md:px-8 py-4 md:py-6 rounded-[2rem] bg-white border-2 border-slate-300 shadow-xl shadow-blue-500/5 text-base md:text-xl font-bold focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-300 pr-16 md:pr-40"
              />
              <button
                onClick={handleDeepScan}
                disabled={isSearching}
                className="absolute right-2 top-2 bottom-2 md:right-3 md:top-3 md:bottom-3 w-12 md:w-auto px-0 md:px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5 md:w-4 md:h-4" />}
                <span className="hidden md:inline">{isSearching ? '분석 중...' : 'DEEP SCAN'}</span>
              </button>
            </div>

            {/* Search Autocomplete Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-200 rounded-[2rem] shadow-2xl p-4 z-50 animate-fade-in divide-y divide-slate-50">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s.ticker}
                    onClick={() => {
                      setSearchTerm(s.name);
                      setShowSuggestions(false);
                      // Optional: 바로 검색 시작하려면 handleDeepScan() 호출 가능
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 transition-all rounded-2xl group text-left"
                  >
                    <StockLogo ticker={s.ticker} size={40} className="shadow-sm" />
                    <div className="flex-1">
                      <div className="font-black text-slate-900 text-lg tracking-tight group-hover:text-blue-600">
                        {s.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {s.ticker} • NASDAQ
                      </div>
                    </div>
                    <div className="text-slate-200 group-hover:text-blue-400">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 font-bold">
            <span className="text-slate-400">🔥 지금 많이 찾는 종목:</span>
            {STOCK_LIST.slice(0, 5).map(s => (
              <button
                key={s.ticker}
                onClick={() => {
                  setSearchTerm(s.name);
                  // Optional: 바로 검색 실행
                }}
                className="px-4 py-1.5 rounded-full bg-white border border-slate-300 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-200/30 rounded-3xl blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-700" />
      </section>

      {/* 💰 중간 광고 배치 */}
      <div className="max-w-7xl mx-auto px-8 mb-20 -mt-10 relative z-20">
        <AdLeaderboard />
      </div>

      {/* 실시간 시장 정보 요약 */}
      <section className="max-w-7xl mx-auto px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">실시간 환율</div>
              <div className="text-xl font-black text-slate-900">₩{exchangeRate.toLocaleString()} <span className="text-xs text-slate-400 font-bold ml-1">USD/KRW</span></div>
            </div>
          </div>
          <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
              <ActivityIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">시장 분위기</div>
              <div className="text-xl font-black text-slate-900">따뜻함 ☀️ <span className="text-xs text-green-600 font-bold">(탐욕 지수: 65)</span></div>
            </div>
          </div>
          <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">AI 오늘 한줄</div>
              <div className="text-xl font-black text-slate-900">"기술주들이 힘을 내고 있어요!"</div>
            </div>
          </div>
        </div>
      </section>

      <LatestNewsInsights />

      {/* 친근한 종목 추천 섹션 (기존 Live Alpha Signals 개편) */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest">AI Pick 추천 종목</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter">
              지금 사람들이 <span className="text-blue-600">가장 많이 보는</span> 종목
            </h2>
          </div>

          <Link href="/analysis" className="px-6 py-3 bg-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2">
            전체 분석 보러가기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[300px] h-64 bg-slate-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 border border-slate-300 rounded-[3rem]">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">검색 결과가 없어요</h3>
            <p className="text-slate-500 text-sm font-bold max-w-md mx-auto mb-8">
              "{searchTerm}" 에 대해 궁금하시다면 <br />
              상단의 <span className="text-blue-600">쉽게 분석하기</span> 버튼을 눌러보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSignals.map((sig, idx) => (
              <div key={idx} className="group bg-white border border-slate-300 rounded-3xl p-6 hover:shadow-xl transition-all shadow-sm relative overflow-hidden flex flex-col hover:border-blue-400">
                {(sig as any).is_real_time && (
                  <div className="absolute top-0 left-0 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-tighter rounded-br-lg z-10 animate-pulse">
                    방금 분석함
                  </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <StockLogo ticker={sig.ticker} name={sig.name} size={40} />
                  <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${sig.sentiment === 'BULLISH' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {sig.sentiment === 'BULLISH' ? '기대돼요' : '잠시 대기'}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{sig.name}</h3>
                <div className="mb-4">
                  <FriendlyPrice usdPrice={sig.price} />
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">AI 신뢰도</span>
                    <span className="text-blue-600 font-black">{sig.impact_score}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div className="text-[7px] text-slate-500 font-bold uppercase mb-0.5">목표 가격</div>
                      <div className="text-sm font-black text-blue-600 tracking-tighter">${sig.target_price}</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div className="text-[7px] text-slate-500 font-bold uppercase mb-0.5">조심할 가격</div>
                      <div className="text-sm font-black text-red-500 tracking-tighter">${sig.stop_loss}</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-6 flex-grow">
                  <p className="text-[10px] text-slate-600 leading-relaxed font-medium line-clamp-3">
                    "{sig.ai_reason}"
                  </p>
                </div>

                <button
                  onClick={() => setSelectedAnalysis(sig)}
                  className="w-full py-3 bg-white border border-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  친절한 리포트 읽기
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🎯 이런 종목은 어때요? (기존 Sector Intelligence 개편) */}
      <section className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-black text-blue-500 uppercase tracking-widest">추천 테마</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter">
              🎯 이런 종목은 <span className="text-indigo-600">어때요?</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: 'ai-revolution', name: '매일 쓰는 기술주', sub: '우리의 삶을 바꾸는 거대 IT 기업들', icon: Cpu, color: 'bg-indigo-50 text-indigo-600', tickers: ['NVDA', 'MSFT', 'GOOGL'] },
            { id: 'brands', name: '먹고 마시는 브랜드', sub: '전 세계 어디서나 사랑받는 익숙한 브랜드', icon: Milestone, color: 'bg-orange-50 text-orange-600', tickers: ['SBUX', 'KO', 'MCD'] },
            { id: 'dividends', name: '월세처럼 배당받기', sub: '잠자는 동안에도 통장에 꽂히는 달러', icon: Award, color: 'bg-green-50 text-green-600', tickers: ['O', 'JNJ', 'KO'] },
            { id: 'mobility', name: '미래를 달리는 자동차', sub: '석유 대신 전기로 움직이는 미래 산업', icon: Zap, color: 'bg-blue-50 text-blue-600', tickers: ['TSLA', 'RIVN', 'LCID'] },
            { id: 'healthcare', name: '건강하게 100세까지', sub: '인류의 수명을 늘려주는 제약/의료 기술', icon: ActivityIcon, color: 'bg-red-50 text-red-600', tickers: ['LLY', 'NVO', 'UNH'] },
          ].map((theme, i) => (
            <Link
              key={i}
              href={`/themes?id=${theme.id}`}
              className="group p-8 rounded-[3rem] bg-white border border-slate-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-400 transition-all flex flex-col h-full shadow-sm"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform ${theme.color}`}>
                <theme.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{theme.name}</h3>
              <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed">{theme.sub}</p>

              <div className="space-y-3 mb-10 selection-none">
                {theme.tickers.map(t => {
                  const data = marketData[t];
                  const isUp = (data?.change || 0) >= 0;
                  return (
                    <div key={t} className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-200 group-hover:bg-white group-hover:border-slate-300 transition-all">
                      <div className="flex items-center gap-3">
                        <StockLogo ticker={t} size={36} className="rounded-xl shadow-xs" />
                        <div>
                          <div className="font-black text-slate-700 text-sm tracking-tighter">{t}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">US Market</div>
                        </div>
                      </div>
                      {data ? (
                        <div className="text-right">
                          <div className={`text-sm font-black tracking-tighter ${isUp ? 'text-red-500' : 'text-blue-500'}`}>
                            {Math.round(data.price * exchangeRate).toLocaleString()}원
                          </div>
                          <div className={`text-[10px] font-black ${isUp ? 'text-red-400' : 'text-blue-400'}`}>
                            {data.change > 0 ? '▲' : '▼'}{Math.abs(data.change).toFixed(1)}%
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-8 bg-slate-200 animate-pulse rounded-lg" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                  분석 리포트 더보기
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Summary Area - Simple & Warm */}
      <section className="py-24 px-8 max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div><div className="text-5xl font-black text-blue-600 mb-2 tracking-tighter">94.2%</div><div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">AI 분석 정확도</div></div>
          <div><div className="text-5xl font-black text-indigo-600 mb-2 tracking-tighter">1.2M+</div><div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">매일 읽는 뉴스 수</div></div>
          <div><div className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">1시간 전</div><div className="text-[10px] font-black text-slate-400 tracking-widest uppercase">최근 분석 업데이트</div></div>
        </div>
      </section>

      {/* Footer - Light & Clean */}
      <footer className="border-t border-slate-200 bg-white py-20 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center gap-8 mb-8 text-slate-300">
            <BookOpen className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
            <MessageSquare className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
            <Award className="w-5 h-5 hover:text-blue-600 cursor-pointer" />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-8">
            &copy; 2026 STOCK EMPIRE. 전 세계 주식 정보를 가장 쉽게 전달합니다.
          </p>
          <div className="max-w-3xl mx-auto border-t border-slate-200 pt-8 opacity-50">
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              본 서비스가 제공하는 정보는 참고용이며, 실제 투자 결과에 대한 책임은 투자 본인에게 있습니다. <br />
              무리한 투자는 금물! 여유 자금으로 건강한 투자를 시작해보세요. 🌱
            </p>
          </div>
        </div>
      </footer>

      {/* Analysis Details Modal - Friendly & Clean */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedAnalysis(null)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-300 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-zoom-in">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                <StockLogo ticker={selectedAnalysis.ticker} name={selectedAnalysis.name} size={64} className="rounded-2xl shadow-md border-2 border-white" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">{selectedAnalysis.name} ({selectedAnalysis.ticker})</h2>
                  <FriendlyPrice usdPrice={selectedAnalysis.price} className="flex-row items-baseline gap-2" />
                </div>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="p-3 bg-white border border-slate-300 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              {/* AI Intelligence Score Section */}
              <div className="mb-12 text-center">
                <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  AI 인공지능 분석 점수
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-7xl font-black text-slate-900 tracking-tighter mb-4 animate-pulse">
                    {selectedAnalysis.impact_score}<span className="text-2xl text-slate-400">점</span>
                  </div>
                  {/* Progress Gauge */}
                  <div className="w-full max-w-md h-4 bg-slate-200 rounded-full overflow-hidden mb-4 p-1 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 transition-all duration-1000 ease-out"
                      style={{ width: `${selectedAnalysis.impact_score}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    {selectedAnalysis.impact_score > 80 ? '🌟 "지금 바로 장바구니에 담아도 좋을 만큼 매력적이에요!"' :
                      selectedAnalysis.impact_score > 60 ? '👍 "나쁘지 않아요! 좀 더 지켜보며 기회를 노려볼까요?"' :
                        '🤔 "아직은 조심할 때예요. 천천히 다시 생각해보는 게 어떨까요?"'}
                  </p>
                </div>
              </div>

              {/* Analysis Cards - MBTI Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="relative group p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-200 hover:shadow-xl hover:bg-indigo-50 transition-all flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <ActivityIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">차트가 말해주는 <br />지금의 분위기 📈</h3>
                  <p className="text-xs font-bold text-indigo-500 mb-6 uppercase">Technical View</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-bold flex-grow">
                    {selectedAnalysis.technical_analysis || "분석 데이터를 불러오는 중입니다."}
                  </p>
                </div>

                <div className="relative group p-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-200 hover:shadow-xl hover:bg-emerald-50 transition-all flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">이 회사의 진짜 실력은 <br />어느 정도인가요? 🏢</h3>
                  <p className="text-xs font-bold text-emerald-500 mb-6 uppercase">Fundamental View</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-bold flex-grow">
                    {selectedAnalysis.fundamental_analysis || "분석 데이터를 불러오는 중입니다."}
                  </p>
                </div>

                <div className="relative group p-8 rounded-[2.5rem] bg-orange-50/50 border border-orange-200 hover:shadow-xl hover:bg-orange-50 transition-all flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">코다리 부장이 제안하는 <br />실행 가이드 🎯</h3>
                  <p className="text-xs font-bold text-orange-500 mb-6 uppercase">Action Plan</p>
                  <div className="p-4 bg-white/50 rounded-2xl border border-orange-300">
                    <p className="text-sm text-orange-800 leading-relaxed font-black italic">
                      {selectedAnalysis.action_plan || "대응 전략을 준비 중입니다."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategic Summary Banner */}
              <div className="p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-200" />
                    <span className="text-xs font-black text-blue-200 uppercase tracking-widest">AI의 결론</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-black italic leading-tight mb-4">
                    "{selectedAnalysis.ai_reason}"
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Stock Empire는 대표님의 안전한 투자를 항상 응원합니다!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="px-6 py-3 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all"
                >
                  나중에 다시 읽기
                </button>
                <Link
                  href="/analysis"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  더 많은 리포트 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
