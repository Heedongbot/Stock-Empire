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
        // Auto-detect language
        const savedLang = localStorage.getItem('stock-empire-lang') as 'ko' | 'en';
        if (savedLang) setLang(savedLang);

        // Initial analysis if query exists
        if (query) {
            handleAnalysis(query);
        }
    }, [query]);

    const handleAnalysis = async (q: string) => {
        setIsAnalyzing(true);
        setMessages(prev => [...prev, { role: 'user', content: q }]);

        // Mock API call simulation
        setTimeout(() => {
            const response = lang === 'ko'
                ? `**${q}**에 대한 NotebookLM 심층 분석 결과입니다.\n\n학습된 문서 12개를 기반으로 분석한 결과, 해당 종목은 현재 **상승 골든크로스** 패턴을 보이고 있습니다. 특히 최근 기관 매수세 유입(120만 주)과 관련 뉴스(3건)가 긍정적 시그널을 보내고 있습니다.\n\n**핵심 요약:**\n1. 매출 성장률: 전년 대비 +15% (예상 상회)\n2. 리스크 요인: 금리 인상에 따른 단기 변동성\n3. 기술적 지표: RSI 65 (매수 유효 구간)\n\n추가 질문이 있으시면 언제든 물어봐주세요.`
                : `Here is the NotebookLM deep analysis for **${q}**.\n\nBased on 12 trained documents, this asset is showing a **Bullish Golden Cross** pattern. Recent institutional inflows (1.2M shares) and related news (3 items) are signaling positive momentum.\n\n**Key Takeaways:**\n1. Revenue Growth: +15% YoY (Beating estimates)\n2. Risk Factors: Short-term volatility due to rate hikes\n3. Technicals: RSI 65 (Buy zone)\n\nFeel free to ask follow-up questions.`;

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsAnalyzing(false);
        }, 2500);
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
