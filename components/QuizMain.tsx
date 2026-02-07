"use client";

import { useState, useEffect } from "react";
import { X, HelpCircle, CheckCircle2, AlertTriangle, RefreshCw, Trophy } from "lucide-react";

// Questions Database (The "1000 Questions" Simulation)
const QUESTIONS = [
    {
        id: 1,
        title: "스톡옵션 희석 폭탄 함정 ⭐⭐⭐⭐",
        level: "Expert",
        question: `V기업(시총 5조, PER 50배)에 투자하려 합니다.
        각주를 보니 '임직원 스톡옵션 3,000만주(30%), 행사가 2만원'이 있습니다.
        현재가는 5만원입니다. 당신의 판단은?`,
        options: [
            { id: "A", text: "직원 복지다. 상관없다. 매수!", correct: false },
            { id: "B", text: "30% 희석 리스크가 크다. 회피한다.", correct: true },
            { id: "C", text: "행사가가 낮아서 행사 안 할 것이다.", correct: false }
        ],
        explanation: `정답은 B입니다.
        스톡옵션 30%는 주당 가치를 즉각 23% 희석시킵니다. 현재가(5만)가 행사가(2만)보다 높으므로 오버행 물량이 쏟아질 확률이 100%입니다. 초보들은 '성장성'만 보지만, 고수는 '잠재물량'을 먼저 체크합니다.`
    },
    {
        id: 2,
        title: "RSI 다이버전스 포착 ⭐⭐⭐",
        level: "Technical",
        question: `주가는 고점을 높이며 상승하고 있습니다. (High -> Higher High)
        하지만 RSI 지표는 고점을 낮추고 있습니다. (High -> Lower High)
        이 현상은 무엇을 암시하나요?`,
        options: [
            { id: "A", text: "강력한 매수 신호 (지속 상승)", correct: false },
            { id: "B", text: "하락 반전 예고 (Bearish Divergence)", correct: true },
            { id: "C", text: "횡보장 진입 신호", correct: false }
        ],
        explanation: `정답은 B입니다 (하락 다이버전스).
        주가는 오르지만 상승 모멘텀(RSI)이 약해지고 있다는 강력한 하락 반전 신호입니다. 이때는 추격 매수를 자제하고 이익 실현을 준비해야 합니다.`
    },
    {
        id: 3,
        title: "금리 인상과 주가 ⭐⭐",
        level: "Macro",
        question: `중앙은행이 기준금리를 0.5%p 깜짝 인상했습니다.
        다음 중 가장 큰 타격을 입을 가능성이 높은 섹터는?`,
        options: [
            { id: "A", text: "고배당 은행주", correct: false },
            { id: "B", text: "현금 흐름이 없는 고평가 성장주", correct: true },
            { id: "C", text: "필수 소비재 (음식료 등)", correct: false }
        ],
        explanation: `정답은 B입니다.
        금리가 오르면 미래 현금 흐름의 할인율이 커져, 당장 돈을 못 벌고 미래 기대감으로 오른 '성장주'의 가치가 급락합니다. 또한 자금 조달 비용이 증가하여 재무가 취약한 기술주에 치명적입니다.`
    },
    {
        id: 4,
        title: "거래량 없는 돌파의 비밀 ⭐⭐⭐",
        level: "Trap Info",
        question: `중요한 저항선을 주가가 돌파했습니다.
        하지만 거래량은 평소와 비슷하거나 오히려 적습니다.
        어떻게 해석해야 할까요?`,
        options: [
            { id: "A", text: "매물대가 없다는 뜻이니 더 좋다.", correct: false },
            { id: "B", text: "개미 털기다. 적극 매수한다.", correct: false },
            { id: "C", text: "가짜 돌파(Fakeout) 가능성이 높다.", correct: true }
        ],
        explanation: `정답은 C입니다.
        거래량이 수반되지 않은 돌파는 '속임수(Fakeout)'일 확률이 매우 높습니다. 세력의 이탈이나 매수세 부재를 의미하므로 다시 저항선 아래로 꽂힐 가능성을 경계해야 합니다.`
    },
    {
        id: 5,
        title: "물타기의 황금 법칙 ⭐⭐⭐⭐",
        level: "Psychology",
        question: `보유 종목이 -20% 하락했습니다. 펀더멘털은 그대로입니다.
        가장 올바른 추가 매수(물타기) 전략은?`,
        options: [
            { id: "A", text: "매일 조금씩 사서 평단을 낮춘다.", correct: false },
            { id: "B", text: "지지선에서 반등이 확인될 때만 산다.", correct: true },
            { id: "C", text: "본전 올 때까지 기도하며 기다린다.", correct: false }
        ],
        explanation: `정답은 B입니다.
        떨어지는 칼날을 잡지 마세요. 무의미한 물타기는 비중만 키워 계좌를 망칩니다. 반드시 의미 있는 지지선에서 '양봉'이나 '반등 시그널'이 확인될 때 불타기를 해야 합니다.`
    },
    {
        id: 6,
        title: "재무제표의 숨은 경고 ⭐⭐⭐",
        level: "Fundamental",
        question: `매출액은 매년 30%씩 성장하고 있습니다.
        하지만 '영업현금흐름'은 3년 연속 마이너스(-)입니다.
        이 기업의 상태는?`,
        options: [
            { id: "A", text: "공격적 투자 중이니 아주 좋다.", correct: false },
            { id: "B", text: "흑자 부도 위험이 있다. 조심해야 한다.", correct: true },
            { id: "C", text: "매출이 왕이다. 무조건 매수.", correct: false }
        ],
        explanation: `정답은 B입니다.
        장부상 이익(매출)은 찍히지만 실제 통장에 돈이 들어오지 않는 상태입니다. 이는 외상 매출이 쌓이거나 재고가 쌓이는 경우가 많으며, 지속되면 흑자 부도가 날 수 있는 위험한 신호입니다.`
    },
    {
        id: 7,
        title: "뉴스 매매의 함정 ⭐⭐",
        level: "News Trading",
        question: `호재 뉴스가 뜨고 주가가 15% 급등했습니다.
        당신은 뉴스를 지금 확인했습니다. 행동 요령은?`,
        options: [
            { id: "A", text: "더 갈 것 같으니 시장가로 매수한다.", correct: false },
            { id: "B", text: "뉴스에 팔아라(Sell the news). 관망한다.", correct: true },
            { id: "C", text: "상한가 따라잡기를 시도한다.", correct: false }
        ],
        explanation: `정답은 B입니다.
        대중이 뉴스를 볼 때쯤이면 이미 정보는 가격에 반영(Pre-priced)되어 있습니다. 소문에 사서 뉴스에 파는 것이 정석입니다. 급등 시 추격 매수는 고점에 물리는 지름길입니다.`
    },
    {
        id: 8,
        title: "손익비(Risk/Reward) 계산 ⭐⭐⭐",
        level: "Risk Mgmt",
        question: `진입가 10,000원, 목표가 11,000원, 손절가 9,500원.
        이 트레이딩 셋업의 손익비는?`,
        options: [
            { id: "A", text: "1 : 1 (나쁨)", correct: false },
            { id: "B", text: "2 : 1 (좋음)", correct: true },
            { id: "C", text: "0.5 : 1 (최악)", correct: false }
        ],
        explanation: `정답은 B입니다.
        기대 수익 1,000원, 감수할 리스크 500원이므로 손익비는 2:1입니다. 훌륭한 트레이더는 최소 2:1 이상의 손익비가 나오는 자리에서만 진입합니다.`
    }
];

export function QuizWidget() {
    const [isOpen, setIsOpen] = useState(false);
    // const [minimized, setMinimized] = useState(false); // Unused for now

    // State for random question logic
    const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);
    const [selected, setSelected] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [streak, setStreak] = useState(0);

    // Initial Random Load
    useEffect(() => {
        loadRandomQuestion();

        // Auto-open logic
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const loadRandomQuestion = () => {
        // Pick a random question different from current if possible
        let nextQ;
        do {
            nextQ = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
        } while (QUESTIONS.length > 1 && nextQ.id === currentQuestion?.id);

        setCurrentQuestion(nextQ);
        setSelected(null);
        setShowResult(false);
    };

    const handleSelect = (id: string) => {
        if (showResult) return;
        setSelected(id);
        setShowResult(true);

        const isCorrect = currentQuestion.options.find(o => o.id === id)?.correct;
        if (isCorrect) {
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-8 z-50 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl animate-bounce flex items-center gap-2 font-bold transition-all hover:scale-110"
        >
            <HelpCircle className="w-6 h-6" />
            <span className="hidden md:inline">오늘의 퀴즈</span>
            {streak > 1 && <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black">x{streak}</span>}
        </button>
    );

    return (
        <div className="fixed bottom-24 right-8 z-50 w-[350px] bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl p-6 font-sans backdrop-blur-xl animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-1.5 rounded-lg relative">
                        <HelpCircle className="w-5 h-5 text-blue-400" />
                        {streak > 1 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-pulse border border-slate-900">
                                {streak}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                            Super Trader Quiz
                            {streak >= 3 && <Trophy className="w-3 h-3 text-yellow-500" />}
                        </h3>
                        <p className="text-[10px] text-slate-400">Level: <span className="text-yellow-500">{currentQuestion.level}</span></p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Question */}
            <div className="mb-6">
                <h4 className="font-bold text-lg text-slate-100 mb-2 leading-snug break-keep">{currentQuestion.title}</h4>
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                    {currentQuestion.question}
                </p>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
                {currentQuestion.options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        disabled={showResult}
                        className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all transform active:scale-98 ${showResult
                            ? opt.correct
                                ? "bg-green-500/20 border border-green-500 text-green-400 font-bold"
                                : selected === opt.id
                                    ? "bg-red-500/20 border border-red-500 text-red-400"
                                    : "bg-slate-800/30 border border-slate-800 text-slate-600 grayscale"
                            : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:border-blue-500/50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${showResult && opt.correct ? "bg-green-500 text-black" : "bg-slate-700"
                                }`}>
                                {opt.id}
                            </span>
                            {opt.text}
                        </div>
                    </button>
                ))}
            </div>

            {/* Result & Explanation via Next Button */}
            {showResult && (
                <div className="animate-fade-in bg-slate-900/80 rounded-xl p-4 border border-slate-700 backdrop-blur-sm relative overflow-hidden">
                    {/* Background Glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none ${currentQuestion.options.find(o => o.id === selected)?.correct ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`} />

                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        {currentQuestion.options.find(o => o.id === selected)?.correct ? (
                            <span className="text-green-400 font-black flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 정답입니다! (+100점)</span>
                        ) : (
                            <span className="text-red-400 font-black flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> 땡! 오답입니다.</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4 relative z-10">
                        {currentQuestion.explanation}
                    </p>

                    <button
                        onClick={loadRandomQuestion}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg relative z-10"
                    >
                        <RefreshCw className="w-4 h-4" /> 다음 문제 도전하기
                    </button>
                </div>
            )}
        </div>
    );
}
