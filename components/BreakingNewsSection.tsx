import { AlertTriangle, TrendingUp, TrendingDown, Clock, Target, DollarSign } from 'lucide-react';

interface BreakingNewsItem {
    original_news: {
        category: string;
        priority: string;
        title: string;
        summary: string;
        published_at: string;
        impact: string;
    };
    analysis: {
        impact_level: string;
        impact_reason: string;
        benefit_sectors: string;
        risk_sectors: string;
        forecast_3days: string;
        forecast_1week: string;
        forecast_1month: string;
        trading_strategy: string;
        analyzed_at: string;
    };
}

interface BreakingNewsSectionProps {
    lang?: 'ko' | 'en';
    userTier?: 'FREE' | 'VIP' | 'VVIP';
}

export function BreakingNewsSection({ lang = 'ko', userTier = 'FREE' }: BreakingNewsSectionProps) {
    const [breakingNews, setBreakingNews] = React.useState<BreakingNewsItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedNews, setSelectedNews] = React.useState<BreakingNewsItem | null>(null);

    const translations = {
        ko: {
            title: "🔴 실시간 속보",
            subtitle: "글로벌 경제지표 긴급 분석",
            analyzedBy: "분석: 코부장",

            impactLevel: "충격도:",
            benefitSectors: "수혜 섹터",
            riskSectors: "피해 섹터",
            forecast3d: "3일 전망",
            forecast1w: "1주 전망",
            forecast1m: "1개월 전망",
            strategy: "투자 전략",
            critical: "초특급",
            high: "상급",
            medium: "중급",
            low: "하급",
            noNews: "현재 속보가 없습니다",
            loading: "속보 로딩 중...",
            vipOnly: "VIP 전용"
        },
        en: {
            title: "🔴 Live Breaking News",
            subtitle: "Global Economic Indicator Analysis",
            analyzedBy: "Analyst: Jung",
            impactLevel: "Impact:",
            benefitSectors: "Beneficiary Sectors",
            riskSectors: "At-Risk Sectors",
            forecast3d: "3-Day Outlook",
            forecast1w: "1-Week Outlook",
            forecast1m: "1-Month Outlook",
            strategy: "Trading Strategy",
            critical: "Critical",
            high: "High",
            medium: "Medium",
            low: "Low",
            noNews: "No breaking news at this time",
            loading: "Loading breaking news...",
            vipOnly: "VIP Only"
        }
    };

    const t = translations[lang];

    React.useEffect(() => {
        fetchBreakingNews();
        const interval = setInterval(fetchBreakingNews, 60000); // Refresh every 1 minute
        return () => clearInterval(interval);
    }, []);

    const fetchBreakingNews = async () => {
        try {
            const res = await fetch(`/api/breaking-news?lang=${lang}`);
            const data = await res.json();
            if (data.breaking_news) {
                setBreakingNews(data.breaking_news);
            }
        } catch (error) {
            console.error('Failed to fetch breaking news:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getImpactColor = (level: string) => {
        const lvl = level.toUpperCase();
        if (lvl.includes('CRITICAL')) return 'from-red-600 to-orange-600';
        if (lvl.includes('HIGH')) return 'from-orange-500 to-amber-500';
        if (lvl.includes('MEDIUM')) return 'from-amber-500 to-yellow-500';
        return 'from-slate-600 to-slate-700';
    };

    const getImpactIcon = (level: string) => {
        const lvl = level.toUpperCase();
        if (lvl.includes('CRITICAL')) return <AlertTriangle className="w-4 h-4" />;
        if (lvl.includes('HIGH')) return <TrendingUp className="w-4 h-4" />;
        return <Target className="w-4 h-4" />;
    };

    if (isLoading) {
        return (
            <div className="mb-12 p-8 border-2 border-red-500/30 rounded-2xl bg-gradient-to-br from-red-950/20 to-orange-950/20">
                <div className="animate-pulse text-center text-slate-400">{t.loading}</div>
            </div>
        );
    }

    if (!breakingNews || breakingNews.length === 0) {
        return null; // Don't show section if no breaking news
    }

    return (
        <>
            <div className="mb-12 border-2 border-red-500/50 rounded-2xl bg-gradient-to-br from-red-950/30 to-orange-950/30 overflow-hidden animate-pulse-border">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 border-b border-red-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                <span className="animate-ping absolute w-3 h-3 bg-red-500 rounded-full"></span>
                                <span className="relative w-3 h-3 bg-red-500 rounded-full"></span>
                                {t.title}
                            </h2>
                            <p className="text-red-100 text-sm mt-1 font-bold">{t.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 text-red-100 text-xs">
                            <Clock className="w-4 h-4" />
                            <span>Live</span>
                        </div>
                    </div>
                </div>

                {/* Breaking News Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {breakingNews.slice(0, 6).map((item, idx) => {
                        const isLocked = userTier === 'FREE';

                        return (
                            <button
                                key={idx}
                                onClick={() => !isLocked && setSelectedNews(item)}
                                className={`bg-slate-900/50 border border-red-500/30 rounded-xl p-6 text-left transition-all hover:border-red-400 hover:bg-slate-900/70 group relative ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                    }`}
                            >
                                {/* Lock Overlay for FREE users */}
                                {isLocked && (
                                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                                        <div className="text-center">
                                            <Lock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                                            <span className="text-amber-500 font-black text-sm">{t.vipOnly}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Priority Badge */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black text-red-400">{item.original_news.category}</span>
                                    <span className="text-[10px] text-slate-500">{item.original_news.priority}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-white font-bold text-sm mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                                    {item.original_news.title}
                                </h3>

                                {/* Impact Badge */}
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getImpactColor(item.analysis.impact_level)} text-white text-xs font-black mb-3`}>
                                    {getImpactIcon(item.analysis.impact_level)}
                                    {item.analysis.impact_level}
                                </div>

                                {/* Strategy Preview (blurred for FREE) */}
                                <p className={`text-slate-400 text-xs leading-relaxed line-clamp-2 ${isLocked ? 'blur-sm' : ''}`}>
                                    {item.analysis.trading_strategy}
                                </p>

                                {/* Timestamp */}
                                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-600">
                                    <span>{t.analyzedBy}</span>
                                    <span>{new Date(item.analysis.analyzed_at).toLocaleTimeString()}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Modal for Detailed Analysis */}
            {selectedNews && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedNews(null)} />

                    <div className="bg-[#0a0f1a] border-2 border-red-500/50 w-full max-w-4xl rounded-3xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto flex flex-col z-10">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-20 bg-gradient-to-r from-red-600 to-orange-600 p-6 border-b border-red-500/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-black text-red-100 mb-2 block">{selectedNews.original_news.category}</span>
                                    <h2 className="text-2xl font-black text-white">{selectedNews.original_news.title}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="p-2 bg-red-700/50 hover:bg-red-700 rounded-full text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-6">
                            {/* Impact Analysis */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-red-400" />
                                    {t.impactLevel}
                                </h3>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getImpactColor(selectedNews.analysis.impact_level)} text-white font-black mb-3`}>
                                    {selectedNews.analysis.impact_level}
                                </div>
                                <p className="text-slate-300 leading-relaxed">{selectedNews.analysis.impact_reason}</p>
                            </div>

                            {/* Sectors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-6">
                                    <h3 className="text-lg font-black text-green-400 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        {t.benefitSectors}
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{selectedNews.analysis.benefit_sectors}</p>
                                </div>
                                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-6">
                                    <h3 className="text-lg font-black text-red-400 mb-3 flex items-center gap-2">
                                        <TrendingDown className="w-5 h-5" />
                                        {t.riskSectors}
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{selectedNews.analysis.risk_sectors}</p>
                                </div>
                            </div>

                            {/* Forecasts */}
                            <div className="space-y-4">
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-sm font-black text-amber-400 mb-2">{t.forecast3d}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{selectedNews.analysis.forecast_3days}</p>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-sm font-black text-blue-400 mb-2">{t.forecast1w}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{selectedNews.analysis.forecast_1week}</p>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-sm font-black text-purple-400 mb-2">{t.forecast1m}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{selectedNews.analysis.forecast_1month}</p>
                                </div>
                            </div>

                            {/* Trading Strategy */}
                            <div className="bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-2 border-amber-500/50 rounded-xl p-6">
                                <h3 className="text-lg font-black text-amber-400 mb-3 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    {t.strategy}
                                </h3>
                                <p className="text-white font-bold text-base leading-relaxed">{selectedNews.analysis.trading_strategy}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Missing imports
import * as React from 'react';
import { Lock, X } from 'lucide-react';
