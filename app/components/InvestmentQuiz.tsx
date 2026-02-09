'use client';

import { useState, useEffect } from 'react';
import { Brain, ArrowRight, Shield, Zap, Target, Award, RefreshCw, X } from 'lucide-react';

type Question = {
    id: number;
    text: string;
    options: { text: string; score: number }[];
};

const questions: Question[] = [
    {
        id: 1,
        text: "주식 시장이 하루 만에 -5% 폭락했습니다. 당신의 첫 반응은?",
        options: [
            { text: "무섭다. 더 떨어지기 전에 전량 매도한다.", score: 1 },
            { text: "불안하지만 일단 관망한다.", score: 3 },
            { text: "기회다! 저가 매수 타이밍을 노린다.", score: 5 },
        ]
    },
    {
        id: 2,
        text: "당신이 추구하는 연간 목표 수익률은?",
        options: [
            { text: "은행 이자보다 조금만 높으면 된다 (5~8%)", score: 1 },
            { text: "시장 평균 정도는 벌어야지 (10~20%)", score: 3 },
            { text: "인생 역전을 원한다 (50% 이상)", score: 5 },
        ]
    },
    {
        id: 3,
        text: "선호하는 종목 스타일은?",
        options: [
            { text: "삼성전자, 코카콜라 같은 망하지 않을 대기업", score: 1 },
            { text: "성장성이 보이는 기술주 (테슬라, 엔비디아)", score: 4 },
            { text: "오늘 사서 내일 파는 밈 코인이나 급등주", score: 5 },
        ]
    },
    {
        id: 4,
        text: "투자 자금의 성격은?",
        options: [
            { text: "절대 잃으면 안 되는 전세금/노후 자금", score: 0 },
            { text: "당장 쓸 일은 없는 여유 자금", score: 3 },
            { text: "없어도 그만인 로또 같은 돈", score: 5 },
        ]
    },
    {
        id: 5,
        text: "재무제표나 기업 분석을 얼마나 하시나요?",
        options: [
            { text: "전혀 안 한다. 뉴스나 차트만 본다.", score: 2 },
            { text: "매출액, 영업이익 정도는 확인한다.", score: 3 },
            { text: "PER, PBR, 현금흐름표까지 꼼꼼히 본다.", score: 5 },
        ]
    }
];

interface QuizProps {
    isOpen?: boolean; // Optional to prevent breaking existing usage if any, but logic handles it
    onClose: () => void;
    lang?: 'ko' | 'en';
}

export default function InvestmentQuiz({ isOpen = true, onClose, lang = 'ko' }: QuizProps) {
    const [step, setStep] = useState(0); // 0 = Intro, 1~5 = Questions, 6 = Result
    const [totalScore, setTotalScore] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);

    // Reset quiz when opened
    useEffect(() => {
        if (isOpen) {
            setStep(0);
            setTotalScore(0);
            setAnswers([]);
        }
    }, [isOpen]);

    // If controlled by prop and false, don't render
    if (!isOpen) return null;

    const handleAnswer = (score: number) => {
        const newScore = totalScore + score;
        setTotalScore(newScore);
        setAnswers([...answers, score]);

        if (step < questions.length) {
            setStep(step + 1);
        } else {
            setStep(6); // Finish
        }
    };

    const getResult = () => {
        if (totalScore <= 8) return {
            type: "Safety Guard 🛡️",
            desc: "안전제일형! 원금 보존이 최우선인 당신.",
            master: "Warren Buffett",
            color: "text-green-400",
            advice: "변동성이 큰 기술주보다는 배당주와 ETF 중심의 포트폴리오가 적합합니다."
        };
        if (totalScore <= 16) return {
            type: "Value Hunter 🦅",
            desc: "합리적 투자자! 리스크와 수익의 균형을 중시합니다.",
            master: "Peter Lynch",
            color: "text-blue-400",
            advice: "실적이 뒷받침되는 성장주를 발굴하여 중장기 보유하는 전략을 추천합니다."
        };
        return {
            type: "Alpha Predator 🦁",
            desc: "야수의 심장! 하이 리스크, 하이 리턴을 즐깁니다.",
            master: "George Soros",
            color: "text-red-500",
            advice: "시장 변동성을 이용한 레버리지 투자나 모멘텀 트레이딩이 어울립니다. 단, VVIP 리스크 관리가 필수입니다."
        };
    };

    const result = getResult();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop with click-to-close */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose} />

            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10 animate-fade-in-up">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-black text-white uppercase tracking-widest">
                            {lang === 'ko' ? 'AI 투자 성향 분석기' : 'AI Investment Validator'}
                        </span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="p-1 rounded-full hover:bg-slate-800 text-slate-500 hover:text-white transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 flex flex-col justify-center">

                    {/* STEP 0: INTRO */}
                    {step === 0 && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Target className="w-10 h-10 text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white italic">당신의 투자 DNA를 분석합니다</h2>
                            <p className="text-slate-400 font-medium">
                                5가지 질문을 통해 당신의 투자 성향을 파악하고,<br />
                                가장 적합한 <span className="text-indigo-400 font-bold">AI 마스터</span>를 매칭해 드립니다.
                            </p>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                            >
                                분석 시작하기
                            </button>
                        </div>
                    )}

                    {/* STEP 1~5: QUESTIONS */}
                    {step > 0 && step <= questions.length && (
                        <div className="space-y-8 animate-slide-up">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <span>Question {step} / 5</span>
                                <span>{Math.round((step / 5) * 100)}% Complete</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
                            </div>

                            <h3 className="text-xl font-bold text-white leading-relaxed">
                                {questions[step - 1].text}
                            </h3>

                            <div className="space-y-3">
                                {questions[step - 1].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option.score)}
                                        className="w-full text-left p-4 bg-slate-800/50 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500 rounded-xl transition-all group"
                                    >
                                        <span className="text-slate-300 group-hover:text-white font-medium flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {option.text}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 6: RESULT */}
                    {step === 6 && (
                        <div className="text-center animate-fade-in-up">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Analysis Complete</p>

                            <div className={`text-4xl font-black ${result.color} italic mb-2`}>
                                {result.type}
                            </div>
                            <p className="text-slate-400 font-bold mb-8 text-sm">
                                {result.desc}
                            </p>

                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">AI Prescription</h4>
                                <p className="text-sm text-slate-300 font-medium leading-relaxed mb-4">
                                    {result.advice}
                                </p>
                                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-xl">
                                        {/* The original emoji '🎩' was here. The user's requested change for this specific div was logically incorrect as 'q' is not defined in this scope and it incorrectly nested other elements. Reverting to original emoji for syntactic correctness and logical flow. */}
                                        🎩
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">MATCHED MASTER</p>
                                        <p className="text-indigo-400 font-black">{result.master} AI</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={onClose} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2">
                                <Zap className="w-5 h-5" /> 추천 전략 적용하기
                            </button>
                            <p
                                onClick={() => setStep(0)}
                                className="mt-4 text-[10px] text-slate-600 cursor-pointer hover:text-slate-400"
                            >
                                다시 테스트하기
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
