'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, Sparkles, Send, ArrowRight, BrainCircuit, ExternalLink } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';

function NotebookContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [lang, setLang] = useState<'ko' | 'en'>('ko');
    const [input, setInput] = useState(query);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentTicker, setCurrentTicker] = useState<string | null>(null);
    const [currentData, setCurrentData] = useState<any | null>(null);

    useEffect(() => {
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);
        if (query) {
            handleAnalysis(query);
        }
    }, [query]);

    const fetchQuote = async (symbol: string) => {
        try {
            const res = await fetch(`/api/quote?symbol=${symbol}`);
            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            return null;
        }
    };

    const isTopicRequest = (q: string) => {
        const triggers = {
            financial: ['재무', '제표', '실적', 'financial', 'earnings', 'statement', 'balance'],
            news: ['뉴스', '소식', '기사', 'news', 'update', 'impact']
        };

        q = q.toLowerCase();
        if (triggers.financial.some(t => q.includes(t))) return 'FINANCIAL';
        if (triggers.news.some(t => q.includes(t))) return 'NEWS';
        return null;
    };

    const generateTopicResponse = (topic: 'FINANCIAL' | 'NEWS', data: any, lang: 'ko' | 'en') => {
        if (!data) return lang === 'ko' ? "분석할 종목 데이터가 없습니다. 먼저 티커를 입력해주세요." : "No data to analyze. Please enter a ticker first.";

        const symbol = data.symbol;
        const name = data.shortName;

        if (topic === 'FINANCIAL') {
            if (lang === 'ko') {
                return `**${name} (${symbol}) 김대리의 재무 심층 분석**\n\n` +
                    `1. **수익성 지표**: 현재 P/E 비율 ${data.trailingPE || 'N/A'}는 업종 평균 대비 ${data.trailingPE > 25 ? '다소 높은' : '매력적인'} 수준입니다.\n` +
                    `2. **현금 흐름**: 거래량 ${data.regularMarketVolume.toLocaleString()}을 기반으로 할 때 유동성은 양호하며, 주가 복원력이 확인됩니다.\n` +
                    `3. **추천 전략**: 분기 실적 발표 전후의 변동성을 활용한 분할 매수 관점이 유리해 보입니다.`;
            } else {
                return `**${name} (${symbol}) Kim Daeri's Deep Financial Analysis**\n\n` +
                    `1. **Profitability**: P/E of ${data.trailingPE || 'N/A'} is ${data.trailingPE > 25 ? 'slightly high' : 'attractive'} relative to sector peers.\n` +
                    `2. **Cash Flow**: Strong liquidity confirmed with ${data.regularMarketVolume.toLocaleString()} volume, showing price resilience.\n` +
                    `3. **Trading Strategy**: A DCA (Dollar Cost Averaging) approach around earnings calls is recommended to mitigate volatility risk.`;
            }
        } else {
            // NEWS Impact
            if (lang === 'ko') {
                return `**${name} (${symbol}) 최근 뉴스 영향력 분석**\n\n` +
                    `최근 시장에서 **${symbol}**에 대한 뉴스 톤은 **${data.regularMarketChangePercent > 0 ? '긍정적' : '신중함'}**이 지배적입니다. 기관 투자자들의 관심도가 상승하고 있으며, 특히 거시 경제 지표 변화가 주가에 민감하게 반영되고 있는 시점입니다.`;
            } else {
                return `**${name} (${symbol}) Recent News Sentiment Analysis**\n\n` +
                    `Market sentiment for **${symbol}** is currently leaning towards **${data.regularMarketChangePercent > 0 ? 'optimism' : 'caution'}**. Institutional interest is rising, and macro-economic shifts are acting as a primary catalyst for immediate price movements.`;
            }
        }
    };

    const generateDynamicResponse = (q: string, data: any, lang: 'ko' | 'en') => {
        if (!data) {
            return lang === 'ko'
                ? `죄송합니다. **${q}**에 대한 실시간 데이터를 찾을 수 없습니다. 티커(Symbol)를 정확히 입력했는지 확인해주세요.`
                : `Sorry, I couldn't find real-time data for **${q}**. Please check if the ticker symbol is correct.`;
        }

        const price = data.regularMarketPrice;
        const change = data.regularMarketChangePercent;
        const isBullish = change > 0;
        const volume = (data.regularMarketVolume / 1000000).toFixed(2); // Million
        const marketCap = (data.marketCap / 1000000000).toFixed(2); // Billion
        const peRatio = data.trailingPE ? data.trailingPE.toFixed(2) : 'N/A';

        const trend = isBullish ? (lang === 'ko' ? '상승세' : 'Upward') : (lang === 'ko' ? '하락세' : 'Downward');
        const sentiment = isBullish ? (lang === 'ko' ? '긍정적' : 'Positive') : (lang === 'ko' ? '보수적' : 'Conservative');

        // Simulation Disclaimer
        let disclaimer = "";
        if (data.isSimulated) {
            disclaimer = lang === 'ko'
                ? "⚠️ **[시뮬레이션 모드 작동]**\n입력하신 티커(**" + (data.symbol || q) + "**)의 실시간 데이터를 찾을 수 없습니다.\n시스템이 **가상의 데이터**를 생성하여 분석 예시를 보여드립니다. (실제 투자가 아닌 기능 테스트용으로 참고하세요.)\n\n---\n\n"
                : "⚠️ **[Simulation Mode Active]**\nReal-time data for **" + (data.symbol || q) + "** could not be found.\nThe system generated **hypothetical data** to demonstrate the analysis features. (Do not use for trading.)\n\n---\n\n";
        }

        if (lang === 'ko') {
            return disclaimer + `**${data.shortName || q} (${data.symbol})**에 대한 김대리의 분석 결과입니다.\n\n` +
                `현재 주가는 **$${price}**로 전일 대비 **${change.toFixed(2)}% ${isBullish ? '상승' : '하락'}**했습니다.\n\n` +
                `**📊 ${data.isSimulated ? '가상' : '실시간'} 데이터 기반 핵심 요약:**\n` +
                `1. **시장 추세**: 현재 **${trend}**를 보이고 있으며, 거래량은 **${volume}M**입니다.\n` +
                `2. **밸류에이션**: 시가총액 **$${marketCap}B**, P/E 비율은 **${peRatio}**입니다.\n` +
                `3. **AI 종합 의견**: 최근 데이터 패턴을 분석할 때 **${sentiment}** 관점이 유효해 보입니다. ${Math.abs(change) > 2 ? '변동성이 크므로 주의가 필요합니다.' : '안정적인 흐름을 유지하고 있습니다.'}\n\n` +
                `더 자세한 재무제표 분석이나 뉴스 영향도가 궁금하다면 말씀해주세요.`;
        } else {
            return disclaimer + `Here is Kim Daeri's analysis for **${data.shortName || q} (${data.symbol})**.\n\n` +
                `The stock is currently trading at **$${price}**, **${isBullish ? 'up' : 'down'} ${change.toFixed(2)}%** from the previous close.\n\n` +
                `**📊 ${data.isSimulated ? 'Simulated' : 'Data-Driven'} Key Takeaways:**\n` +
                `1. **Market Trend**: Showing a **${trend}** trend with a volume of **${volume}M**.\n` +
                `2. **Valuation**: Market Cap is **$${marketCap}B** with a P/E Ratio of **${peRatio}**.\n` +
                `3. **AI Verdict**: Based on recent patterns, a **${sentiment}** outlook is suggested. ${Math.abs(change) > 2 ? 'High volatility detected, proceed with caution.' : 'Maintaining a stable flow.'}\n\n` +
                `Let me know if you need deeper financial analysis or news impact assessments.`;
        }
    };

    const handleAnalysis = async (q: string) => {
        setIsAnalyzing(true);
        const userMsg = q;

        // Add user message to UI
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        const topic = isTopicRequest(userMsg);

        if (topic && currentData) {
            // Context-based follow up
            setTimeout(() => {
                const response = generateTopicResponse(topic, currentData, lang);
                setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                setIsAnalyzing(false);
            }, 1000);
            return;
        }

        // New ticker lookup
        const quoteData = await fetchQuote(q);
        if (quoteData) {
            setCurrentTicker(quoteData.symbol);
            setCurrentData(quoteData);
        }

        setTimeout(() => {
            const response = generateDynamicResponse(q, quoteData, lang);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsAnalyzing(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleAnalysis(input);
            setInput('');
        }
    };


    return (
        <div className="min-h-screen bg-[#050b14] text-white font-sans flex flex-col">
            <SiteHeader lang={lang} setLang={setLang} />

            <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 animate-pulse">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                            Kim Daeri<span className="text-blue-400">'s</span> Insights
                        </h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            {lang === 'ko' ? '김대리의 인공지능 분석' : 'Powered by Kim Daeri AI'}
                        </p>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative min-h-[500px]">
                    <div className="absolute inset-0 pointer-events-none bg-[url('/grid-pattern.svg')] opacity-5"></div>

                    {/* Messages Area */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
                        {messages.length === 0 && !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                                <Sparkles className="w-12 h-12 mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest">Ready to analyze trained documents</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${msg.role === 'user'
                                    ? 'bg-slate-800 text-white rounded-tr-none'
                                    : 'bg-indigo-900/20 border border-indigo-500/20 text-slate-200 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isAnalyzing && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-bounce">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Analyzing Documents...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-950 border-t border-slate-800">
                        <form onSubmit={handleSubmit} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={lang === 'ko' ? "추가 질문을 입력하세요..." : "Ask follow-up questions..."}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500 font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isAnalyzing}
                                className="absolute right-2 top-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-4 flex justify-center">
                    <a href="https://notebooklm.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
                        Launch Global Knowledge Base <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </main>
        </div>
    );
}

export default function NotebookPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white font-black uppercase tracking-widest">Accessing Knowledge Base...</div>}>
            <NotebookContent />
        </Suspense>
    );
}
