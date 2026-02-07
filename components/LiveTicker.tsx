'use client';

import { useEffect, useState } from 'react';

export default function LiveTicker() {
  const [tickerData, setTickerData] = useState([
    { symbol: 'NASDAQ 100', value: 18234.56, change: 1.24, changePercent: '+1.24%' },
    { symbol: 'S&P 500', value: 4892.34, change: 0.85, changePercent: '+0.85%' },
    { symbol: 'SOX (PHLX)', value: 4532.12, change: 2.15, changePercent: '+2.15%' },
    { symbol: 'DOW JONES', value: 38234.56, change: -0.42, changePercent: '-0.42%' },
    { symbol: 'NVDA', value: 845.30, change: 4.2, changePercent: '+4.2%' },
    { symbol: 'TSLA', value: 184.20, change: -1.8, changePercent: '-1.8%' },
    { symbol: 'AAPL', value: 185.50, change: 3.5, changePercent: '+3.5%' },
    { symbol: 'PLTR', value: 24.50, change: 5.2, changePercent: '+5.2%' },
    { symbol: 'MSTR', value: 1245.30, change: 8.4, changePercent: '+8.4%' },
  ]);

  // 실시간 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => ({
        ...item,
        change: item.change + (Math.random() - 0.5) * 0.1,
        changePercent: item.change > 0
          ? `+${Math.abs(item.change).toFixed(2)}%`
          : `${item.change.toFixed(2)}%`
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker-wrapper bg-slate-950 border-b border-slate-800 overflow-hidden relative z-40">
      <div className="ticker-track flex items-center gap-8 py-2">
        {/* 데이터 4번 반복으로 끊김 없는 무한 스크롤 구현 */}
        {[...tickerData, ...tickerData, ...tickerData, ...tickerData].map((item, idx) => (
          <div key={`ticker-${idx}`} className="ticker-item flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs font-black text-slate-400 uppercase">{item.symbol}</span>
            <span className={`text-xs font-bold ${item.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
              {item.changePercent}
            </span>
            {/* 구분선 */}
            <span className="text-slate-800 text-[10px]">|</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-wrapper {
          width: 100%;
          position: relative;
        }

        .ticker-track {
          width: max-content;
          animation: scroll 60s linear infinite;
        }

        /* 
           데이터가 4세트이므로, 1세트(25%)만큼 이동했을 때 
           처음 위치(0%)와 시각적으로 동일해짐.
           따라서 -25%까지만 이동하고 0%로 리셋하면 무한 루프처럼 보임.
        */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
