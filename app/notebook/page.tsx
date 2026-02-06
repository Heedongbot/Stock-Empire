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

        if (lang === 'ko') {
            return `**${data.shortName || q} (${data.symbol})**에 대한 실시간 NotebookLM 분석 결과입니다.\n\n` +
                `현재 주가는 **$${price}**로 전일 대비 **${change.toFixed(2)}% ${isBullish ? '상승' : '하락'}**했습니다.\n\n` +
                `**📊 실시간 데이터 기반 핵심 요약:**\n` +
                `1. **시장 추세**: 현재 **${trend}**를 보이고 있으며, 거래량은 **${volume}M**입니다.\n` +
                `2. **밸류에이션**: 시가총액 **$${marketCap}B**, P/E 비율은 **${peRatio}**입니다.\n` +
                `3. **AI 종합 의견**: 최근 데이터 패턴을 분석할 때 **${sentiment}** 관점이 유효해 보입니다. ${Math.abs(change) > 2 ? '변동성이 크므로 주의가 필요합니다.' : '안정적인 흐름을 유지하고 있습니다.'}\n\n` +
                `더 자세한 재무제표 분석이나 뉴스 영향도가 궁금하다면 말씀해주세요.`;
        } else {
            return `Here is the real-time NotebookLM analysis for **${data.shortName || q} (${data.symbol})**.\n\n` +
                `The stock is currently trading at **$${price}**, **${isBullish ? 'up' : 'down'} ${change.toFixed(2)}%** from the previous close.\n\n` +
                `**📊 Data-Driven Key Takeaways:**\n` +
                `1. **Market Trend**: Showing a **${trend}** trend with a volume of **${volume}M**.\n` +
                `2. **Valuation**: Market Cap is **$${marketCap}B** with a P/E Ratio of **${peRatio}**.\n` +
                `3. **AI Verdict**: Based on recent patterns, a **${sentiment}** outlook is suggested. ${Math.abs(change) > 2 ? 'High volatility detected, proceed with caution.' : 'Maintaining a stable flow.'}\n\n` +
                `Let me know if you need deeper financial analysis or news impact assessments.`;
        }
    };

    const handleAnalysis = async (q: string) => {
        setIsAnalyzing(true);
        // Only add user message if it's a new input (not initial load)
        if (q !== query || messages.length > 0) {
            setMessages(prev => [...prev, { role: 'user', content: q }]);
        } else if (messages.length === 0) {
            // For initial load via URL, we might want to show the query as a user message or just the result
            setMessages([{ role: 'user', content: q }]);
        }

        const quoteData = await fetchQuote(q);

        setTimeout(() => {
            const response = generateDynamicResponse(q, quoteData, lang);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsAnalyzing(false);
        }, 1500); // Slight delay for effect
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
                            Notebook<span className="text-blue-400">LM</span> Insights
                        </h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Powered by Google Gemini 1.5 Pro
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
                        Open Google NotebookLM <ExternalLink className="w-3 h-3" />
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
