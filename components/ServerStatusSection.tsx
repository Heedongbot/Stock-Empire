import React, { useState, useEffect } from 'react';
import { Server, Activity, Database, Globe, Terminal, MoreVertical, CheckCircle2, Cpu } from 'lucide-react';

export default function ServerStatusSection() {
    const [cpuLoad, setCpuLoad] = useState(12);
    const [ramUsage, setRamUsage] = useState(312); // MB

    useEffect(() => {
        const interval = setInterval(() => {
            setCpuLoad(Math.floor(Math.random() * 15) + 5);
            setRamUsage(312 + Math.floor(Math.random() * 20));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white border border-slate-300 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <Server className="w-5 h-5" />
                    </div>
                    <span>인프라 가동 상태</span>
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Live</span>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 relative group hover:border-blue-400 transition-all">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo-ubuntu_codectrl.png" alt="Ubuntu" className="w-8 h-8 opacity-80" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                Ubuntu-1
                                <Terminal className="w-3.5 h-3.5 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                            </h4>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">512 MB RAM, 2 vCPUs, 20 GB SSD</p>
                            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400 font-bold">
                                <Database className="w-3 h-3" /> General purpose
                            </div>
                        </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-px bg-slate-200 mb-6"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-black text-emerald-600 uppercase">Running</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-700 font-mono">54.180.238.33</span>
                            <span className="text-[8px] text-slate-400 font-mono truncate max-w-[150px]">2406:da12:167:e500:cf1a:ea2f:e008:479e</span>
                            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400 font-bold">
                                <Globe className="w-3 h-3" /> Seoul, Zone A
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:w-24">
                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1">
                                <span>CPU</span>
                                <span>{cpuLoad}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${cpuLoad}%` }}></div>
                            </div>
                        </div>
                        <div className="flex-1 md:w-24">
                            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1">
                                <span>RAM</span>
                                <span>{Math.round((ramUsage / 512) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(ramUsage / 512) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex-1 min-w-[140px]">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <div>
                        <div className="text-[9px] text-slate-400 font-black uppercase">크롤러 상태</div>
                        <div className="text-xs font-black text-slate-800">ONLINE (5m ago)</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex-1 min-w-[140px]">
                    <Cpu className="w-4 h-4 text-indigo-500" />
                    <div>
                        <div className="text-[9px] text-slate-400 font-black uppercase">AI 엔진 부하</div>
                        <div className="text-xs font-black text-slate-800">NORMAL (8.2%)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
