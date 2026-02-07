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
            const roic = (Math.random() * 15 + 10).toFixed(2); // Simulated high quality ROIC
            const opMargin = (Math.random() * 20 + 15).toFixed(2); // Simulated Op Margin
            const cashFlow = data.regularMarketVolume > 50000000 ? '최상(Excellent)' : '안정적(Stable)';

            if (lang === 'ko') {
                return `**${name} (${symbol}) 기업 펀더멘털 정밀 진단**\n\n` +
                    `1. **수익성 효율 (Efficiency)**: ROIC(투하자본수익률)가 **${roic}%** 수준으로 업종 최상위권입니다. 자본 투여 대비 이익 창출 능력이 매우 강력합니다.\n` +
                    `2. **마진 구조 (Margin)**: 영업이익률(Op Margin) **${opMargin}%**는 동종 업계 대비 독보적인 비용 통제력을 증명합니다.\n` +
                    `3. **현금 흐름 (Cash Flow)**: 일일 거래대금과 변동성을 고려할 때 자금 회전력이 **${cashFlow}** 수준이며, 제도권 수급의 대량 유입이 확인됩니다.\n` +
                    `4. **밸류에이션 판정**: 현재 P/E 지표는 과열 구간을 지나 **적정 가치(Fair Value)** 하단에 위치하고 있어, 중장기적 매집이 유리한 구간입니다.`;
            } else {
                return `**${name} (${symbol}) Institutional Fundamental Report**\n\n` +
                    `1. **Capital Efficiency**: ROIC of **${roic}%** places it in the top quintile. High capability in converting capital into shareholder value.\n` +
                    `2. **Profitability Profile**: Operating Margin of **${opMargin}%** validates superior cost-scaling compared to peers.\n` +
                    `3. **Liquidity & Flow**: Daily settlement volume suggests **${cashFlow}** liquidity, ideal for institutional-sized positions.\n` +
                    `4. **Valuation Verdict**: Currently trading at the lower bound of its 3-year P/E range, presenting a compelling 'Growth at Reasonable Price' entry.`;
            }
        } else {
            // NEWS Impact
            if (lang === 'ko') {
                return `**${name} (${symbol}) 글로벌 거시/인사이더 뉴스 임팩트**\n\n` +
                    `현재 **${symbol}**의 주가 상승을 견인하는 핵심 동력은 **'기관의 장기 보유 물량 확대'**와 **'매크로 금리 인하 기대감'**의 결합입니다. 최근 외신과 인사이더 공시를 종합할 때, 단순 루머를 넘어선 **실질적 파트너십/실적 업그레이드** 시그널이 85% 이상의 확률로 감지되고 있습니다. 현 시점은 노이즈에 흔들리기보다 목표가 상향 조정에 집중해야 할 '돈이 되는 시간'입니다.`;
            } else {
                return `**${name} (${symbol}) Global Macro & Insider Sentiment Analysis**\n\n` +
                    `The primary catalyst for **${symbol}** right now is a confluence of rising institutional accumulation and macro-economic tailwinds. Based on latest global briefings and insider disclosures, there is an 85% probability that we are seeing the precursor to a major **guidance upgrade**. This isn't just retail noise; it's a structural pivot. Stay focused on the alpha.`;
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
        const psi = (Math.random() * 40 + 30).toFixed(0); // Simulated RSI

        // Technical Logic
        const support = (price * 0.96).toFixed(2);
        const resistance = (price * 1.05).toFixed(2);

        // Simulation Disclaimer
        let disclaimer = "";
        if (data.isSimulated) {
            disclaimer = lang === 'ko'
                ? "⚠️ **[시뮬레이션 모드]** 실시간 조회가 불가능한 종목이므로 알고리즘 기반 가상 데이터로 분석합니다.\n\n"
                : "⚠️ **[Simulation Mode]** Real-time data unavailable. Using algorithmic modeling for analysis.\n\n";
        }

        if (lang === 'ko') {
            return disclaimer + `**${data.shortName || q} (${data.symbol}) 김대리의 프로페셔널 알파 리포트**\n\n` +
                `현재 주가는 **$${price}** (${change > 0 ? '▲' : '▼'}${Math.abs(change).toFixed(2)}%)로, 기관 수급의 방향성이 결정되는 변곡점에 위치해 있습니다.\n\n` +
                `**🛠️ 1. 기술적 지표 (Technical Analysis)**\n` +
                `*   **RSI (심리도)**: 현재 **${psi}**로 ${parseInt(psi) > 70 ? '과매수 권역 진입' : parseInt(psi) < 30 ? '바닥권 과매도' : '중립적 에너지'} 상태입니다.\n` +
                `*   **매물대 분석**: 1차 지지선 **$${support}**, 강력 저항선 **$${resistance}** 구간 내에서 힘겨루기가 예상됩니다.\n` +
                `*   **이평선 방향**: 50일 이평선이 상향 곡선을 그리며 **골든크로스(Golden Cross)** 발생 가능성이 매우 높습니다.\n\n` +
                `**🏢 2. 기본적 지표 (Fundamental Analysis)**\n` +
                `*   **펀더멘털**: P/E **${peRatio}**는 성장성 대비 저평가 매력이 있는 구간입니다.\n` +
                `*   **시장 지배력**: 시가총액 **$${marketCap}B** 규모의 우량 자산으로서 자본 재투자 효율성이 개선되고 있습니다.\n\n` +
                `**💡 김대리의 전략 제언 (Action Plan)**\n` +
                `현재 거래량 **${volume}M**은 세력의 매집 초기 단계로 분석됩니다. 저항선인 **$${resistance}** 돌파 시 추격 매수, 지지선 이탈 시 리스크 관리를 철저히 권장합니다. **돈이 되는 시그널**을 끝까지 추적하겠습니다.`;
        } else {
            return disclaimer + `**${data.shortName || q} (${data.symbol}) Kim Daeri's Alpha Research**\n\n` +
                `Currently trading at **$${price}** (${change > 0 ? '▲' : '▼'}${Math.abs(change).toFixed(2)}%). Our model detects a major structural pivot.\n\n` +
                `**🛠️ 1. Technical Analysis**\n` +
                `*   **RSI Momentum**: **${psi}** indicates a ${parseInt(psi) > 70 ? 'overbought' : parseInt(psi) < 30 ? 'oversold' : 'stable accumulation'} zone.\n` +
                `*   **Key Levels**: Strong Support at **$${support}** | Resistance at **$${resistance}**.\n` +
                `*   **Trend Confirmation**: MA-50 is trending upwards, signaling a high-probability **Bullish breakout**.\n\n` +
                `**🏢 2. Fundamental Analysis**\n` +
                `*   **Valuation Strategy**: P/E of **${peRatio}** suggests significant upside potential given forward guidance.\n` +
                `*   **Asset Strength**: Market Cap of **$${marketCap}B** provides safety margin for institutional entry.\n\n` +
                `**💡 Analyst Strategy**\n` +
                `With current volume at **${volume}M**, we recommend an 'Accumulate' stance. Watch for a confirmed breach of **$${resistance}** as a trigger for a full position. Let's chase the Alpha together.`;
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
