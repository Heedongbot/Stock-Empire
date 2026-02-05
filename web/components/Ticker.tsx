"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const TICKER_ITEMS = [
  { symbol: "KOSPI", price: "2,650.45", change: "+0.85%", up: true },
  { symbol: "KOSDAQ", price: "870.12", change: "+1.24%", up: true },
  { symbol: "S&P500", price: "5,102.30", change: "+0.45%", up: true },
  { symbol: "NASDAQ", price: "16,023.11", change: "+1.10%", up: true },
  { symbol: "NVDA", price: "$920.50", change: "+3.2%", up: true },
  { symbol: "TSLA", price: "$175.30", change: "-1.5%", up: false },
  { symbol: "AAPL", price: "$172.10", change: "-0.4%", up: false },
  { symbol: "BTC", price: "$68,500", change: "+2.1%", up: true },
  { symbol: "USD/KRW", price: "1,340.50", change: "+0.1%", up: true },
];

export function Ticker() {
  return (
    <div className="w-full bg-[#02060a] border-b border-slate-900 overflow-hidden h-14 flex items-center relative z-40">
      <div className="flex animate-ticker whitespace-nowrap">
        {/* Triple duplication for smooth infinite loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 mx-8 text-lg font-black tracking-wider font-mono">
            <span className="text-slate-400">{item.symbol}</span>
            <span className="text-white">{item.price}</span>
            <span className={`flex items-center gap-1 ${item.up ? 'text-red-500' : 'text-blue-500'}`}>
              {item.up ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* CSS for infinite scroll */}
      <style jsx>{`
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
