import { useState } from "react";
import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";
import Block from "./Block";
import type { QuizActionType } from "../utils/types/QuizActionType";

type QuizLoadedProps = {
    questionInstances: QuestionInstanceType[];
    quizDispatch: React.Dispatch<QuizActionType>;
};

type CurrentQuestion = {
    id: number;
    question: string;
};

export default function QuizReady({
    questionInstances,
    quizDispatch,
}: QuizLoadedProps) {
    const [currentQuestion, setCurrentQuestion] =
        useState<CurrentQuestion | null>(null);
    return (
        <div className="quiz-ready-wrapper">
            <div className="quiz-text">
                <h2>Quiz Loaded!</h2>
                <p>
                    {questionInstances.length} question
                    {questionInstances.length === 1 ? "" : "s"} are loaded and
                    ready to go!
                </p>
                <button onClick={() => quizDispatch({ type: "startQuiz" })}>
                    Start Quiz
                </button>
            </div>
            <div className="quiz-summary">
                <span>Click on the number to see the question</span>
                <div className="quiz-item-wrapper">
                    <div className="quiz-grid">
                        {questionInstances.map((q, i) => {
                            return (
                                <button
                                    key={q.question}
                                    className="quiz-item"
                                    onClick={() =>
                                        setCurrentQuestion({
                                            id: i,
                                            question: q.question,
                                        })
                                    }
                                >
                                    <p>
                                        {i + 1 < 10 && "0"}
                                        {i + 1}
                                    </p>
                                    <Block />
                                </button>
                            );
                        })}
                    </div>
                    {currentQuestion && (
                        <div className="quiz-question">
                            <p>
                                {currentQuestion.id + 1 < 10 && "0"}
                                {currentQuestion.id + 1}.
                            </p>
                            <p>{currentQuestion.question}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
