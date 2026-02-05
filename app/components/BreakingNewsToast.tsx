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
                const res = await fetch(`/us-news-tiered.json?t=${Date.now()}`);
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
        <div className="fixed bottom-6 right-6 z-[9999] animate-slide-up-fade">
            <div className="bg-[#0f172a] border-l-4 border-l-amber-500 border-y border-r border-[#1e293b] rounded-r-lg shadow-2xl p-4 max-w-sm relative overflow-hidden group">

                {/* Background Glow */}
                <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full blur-3xl opacity-20 ${news.sentiment === 'BULLISH' ? 'bg-green-500' : news.sentiment === 'BEARISH' ? 'bg-red-500' : 'bg-amber-500'}`}></div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 pr-6">
                    <div className={`p-3 rounded-full mt-1 ${news.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-500' : news.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {news.sentiment === 'BULLISH' ? <TrendingUp className="w-6 h-6 animate-pulse" /> :
                            news.sentiment === 'BEARISH' ? <TrendingDown className="w-6 h-6 animate-pulse" /> :
                                <Bell className="w-6 h-6 animate-pulse" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-amber-500" /> Breaking News
                            </span>
                            <span className="text-[10px] text-slate-500">Just Now</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-tight mb-2 line-clamp-2">
                            {news.free_tier.title}
                        </h4>
                        <a
                            href={news.free_tier.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                        >
                            Read Full Story <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
