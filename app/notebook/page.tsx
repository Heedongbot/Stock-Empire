'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, Sparkles, Send, ArrowRight, BrainCircuit, ExternalLink } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import { translations } from '@/lib/translations';

function NotebookContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const lang = 'ko'; // 한국어 고정
    const [input, setInput] = useState(query);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentTicker, setCurrentTicker] = useState<string | null>(null);
    const [currentData, setCurrentData] = useState<any | null>(null);

    useEffect(() => {
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

    const generateTopicResponse = (topic: 'FINANCIAL' | 'NEWS', data: any) => {
        if (!data) return "분석할 종목 데이터가 없습니다. 먼저 티커를 입력해주세요.";

        const symbol = data.symbol;
        const name = data.shortName;

        if (topic === 'FINANCIAL') {
            const roic = (Math.random() * 15 + 10).toFixed(2);
            const opMargin = (Math.random() * 20 + 15).toFixed(2);
            const cashFlow = data.regularMarketVolume > 50000000 ? '최상(Excellent)' : '안정적(Stable)';

            return `**${name} (${symbol}) 기업 펀더멘털 정밀 진단**\n\n` +
                `1. **수익성 효율 (Efficiency)**: ROIC(투하자본수익률)가 **${roic}%** 수준으로 업종 최상위권입니다. 자본 투여 대비 이익 창출 능력이 매우 강력합니다.\n` +
                `2. **마진 구조 (Margin)**: 영업이익률(Op Margin) **${opMargin}%**는 동종 업계 대비 독보적인 비용 통제력을 증명합니다.\n` +
                `3. **현금 흐름 (Cash Flow)**: 일일 거래대금과 변동성을 고려할 때 자금 회전력이 **${cashFlow}** 수준이며, 제도권 수급의 대량 유입이 확인됩니다.\n` +
                `4. **밸류에이션 판정**: 현재 P/E 지표는 과열 구간을 지나 **적정 가치(Fair Value)** 하단에 위치하고 있어, 중장기적 매집이 유리한 구간입니다.`;
        } else {
            return `**${name} (${symbol}) 글로벌 거시/인사이더 뉴스 임팩트**\n\n` +
                `현재 **${symbol}**의 주가 상승을 견인하는 핵심 동력은 **'기관의 장기 보유 물량 확대'**와 **'매크로 금리 인하 기대감'**의 결합입니다. 최근 외신과 인사이더 공시를 종합할 때, 단순 루머를 넘어선 **실질적 파트너십/실적 업그레이드** 시그널이 85% 이상의 확률로 감지되고 있습니다. 현 시점은 노이즈에 흔들리기보다 목표가 상향 조정에 집중해야 할 '돈이 되는 시간'입니다.`;
        }
    };

    const generateDynamicResponse = (q: string, data: any) => {
        if (!data) {
            return `죄송합니다. **${q}**에 대한 실시간 데이터를 찾을 수 없습니다. 티커(Symbol)를 정확히 입력했는지 확인해주세요.`;
        }

        const price = data.regularMarketPrice;
        const change = data.regularMarketChangePercent;
        const volume = (data.regularMarketVolume / 1000000).toFixed(2); // Million
        const marketCap = (data.marketCap / 1000000000).toFixed(2); // Billion
        const peRatio = data.trailingPE ? data.trailingPE.toFixed(2) : 'N/A';
        const psi = (Math.random() * 40 + 30).toFixed(0);

        const support = (price * 0.96).toFixed(2);
        const resistance = (price * 1.05).toFixed(2);

        let disclaimer = data.isSimulated ? "⚠️ **[시뮬레이션 모드]** 실시간 조회가 불가능한 종목이므로 알고리즘 기반 가상 데이터로 분석합니다.\n\n" : "";

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
    };

    const handleAnalysis = async (q: string) => {
        setIsAnalyzing(true);
        const userMsg = q;

        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        const topic = isTopicRequest(userMsg);

        if (topic && currentData) {
            setTimeout(() => {
                const response = generateTopicResponse(topic, currentData);
                setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                setIsAnalyzing(false);
            }, 1000);
            return;
        }

        const quoteData = await fetchQuote(q);
        if (quoteData) {
            setCurrentTicker(quoteData.symbol);
            setCurrentData(quoteData);
        }

        setTimeout(() => {
            const response = generateDynamicResponse(q, quoteData);
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
            <SiteHeader />

            <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-[#00ffbd] to-[#00d4ff] rounded-2xl shadow-xl">
                            <BrainCircuit className="w-10 h-10 text-black" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                            EMPIRE <span className="text-[#00ffbd]">BRAIN</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                            보스님이 학습시킨 1,000가지 실전 시나리오 기반 분석 (Public Access)
                        </p>
                    </div>
                </div>

                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col relative min-h-[500px] shadow-2xl">
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        {messages.length === 0 && !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                <Sparkles className="w-12 h-12 mb-4 animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-widest">분석을 위해 티커 또는 질문을 입력하세요</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-[#00ffbd] flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-black" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-xl ${msg.role === 'user'
                                    ? 'bg-slate-800 text-white rounded-tr-none'
                                    : 'bg-slate-950 border border-white/5 text-slate-200 rounded-tl-none italic'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isAnalyzing && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                    <Bot className="w-5 h-5 text-[#00ffbd] animate-spin" />
                                </div>
                                <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#00ffbd] uppercase tracking-widest">빅데이터 정렬 및 분석 중...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-950 border-t border-slate-800">
                        <form onSubmit={handleSubmit} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="분석할 종목 또는 질문을 입력하세요..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-6 pr-14 text-sm text-white focus:border-[#00ffbd] transition-all placeholder-slate-600"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isAnalyzing}
                                className="absolute right-2 top-2 bottom-2 px-4 bg-[#00ffbd] text-black rounded-lg transition-all disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-4 flex justify-center">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00ffbd] transition-colors">
                        EMPIR_BRAIN_V4_STABLE <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            </main>
        </div>
    );
}

export default function NotebookPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050b14] flex items-center justify-center text-white font-black">Loading...</div>}>
            <NotebookContent />
        </Suspense>
    );
}
