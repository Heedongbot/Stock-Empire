'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Zap, Bell, Volume2, TrendingUp, TrendingDown } from 'lucide-react';

interface NewsItem {
    id: string;
    is_breaking?: boolean;
    sentiment: string;
    published_at: string;
    free_tier: {
        title: string;
        link: string;
    };
}

export default function BreakingNewsToast() {
    const [news, setNews] = useState<NewsItem | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkBreakingNews = async () => {
            try {
                // Add timestamp to prevent caching
                const res = await fetch(`/us-news-realtime.json?t=${Date.now()}`);
                if (!res.ok) return;

                const data: NewsItem[] = await res.json();
                if (!data || data.length === 0) return;

                // Get the latest breaking news
                const latest = data.find(item => item.is_breaking);
                if (!latest) return;

                // Check if already seen
                const lastSeenId = localStorage.getItem('last-breaking-news-id');
                if (latest.id !== lastSeenId) {
                    setNews(latest);
                    setIsVisible(true);

                    // Play sound effect (optional)
                    try {
                        const audio = new Audio('/sounds/alert.mp3'); // Need file, but browser might block
                        // audio.play().catch(() => {}); 
                    } catch (e) { }

                    // Save as seen
                    localStorage.setItem('last-breaking-news-id', latest.id);
                }
            } catch (e) {
                console.error("News check failed:", e);
            }
        };

        // Initial check
        checkBreakingNews();

        // Poll every 60 seconds
        const interval = setInterval(checkBreakingNews, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible || !news) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[9999] animate-slide-up-fade">
            <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl p-3 max-w-[280px] relative overflow-hidden group hover:border-amber-500/50 transition-all">

                {/* Background Glow */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-slate-600 hover:text-white transition-colors z-20"
                >
                    <X className="w-3 h-3" />
                </button>

                <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${news.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-500' : news.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {news.sentiment === 'BULLISH' ? <TrendingUp className="w-3.5 h-3.5" /> :
                            news.sentiment === 'BEARISH' ? <TrendingDown className="w-3.5 h-3.5" /> :
                                <Bell className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-0.5 animate-pulse">
                                <Zap className="w-2.5 h-2.5 fill-amber-500" /> LIVE
                            </span>
                            <span className="text-[8px] text-slate-500 font-bold">Just Now</span>
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-200 leading-tight mb-1.5 line-clamp-2 pr-4">
                            {news.free_tier.title}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
