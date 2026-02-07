export interface QuizQuestion {
    id: number;
    title: string;
    level: 'Beginner' | 'Technical' | 'Macro' | 'Expert' | 'Psychology';
    question: string;
    options: { id: string; text: string; correct: boolean }[];
    explanation: string;
}

// 이 곳에 NotebookLM에서 추출한 1000문제를 순차적으로 삽입할 예정입니다.
export const NOTEBOOK_LM_QUESTIONS: QuizQuestion[] = [
    {
        id: 101,
        title: "연준(Fed)의 역공작 포착 ⭐⭐⭐⭐⭐",
        level: "Macro",
        question: "연준이 금리를 유지했음에도 불구하고, 점도표(Dot Plot)를 통해 '연내 추가 인상' 가능성을 시사했습니다. 이 현상을 시장은 무엇이라 부르나요?",
        options: [
            { id: "A", text: "Hawkish Hold (매파적 동결)", correct: true },
            { id: "B", text: "Dovish Hike (비둘기파적 인상)", correct: false },
            { id: "C", text: "Neutral Pivot (중립적 전환)", correct: false }
        ],
        explanation: "금리는 동결했지만 향후 인상 가능성을 열어두어 시장의 기대를 억제하는 '매파적 동결(Hawkish Hold)'입니다. NotebookLM 분석에 따르면 고수들은 금리 숫자보다 점도표의 기울기에 주목합니다."
    }
];
