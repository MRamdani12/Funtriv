import { useState } from "react";

import Block from "./ui/Block";
import { useQuizStateContext } from "../hooks/useQuizStateContext";
import { useQuizDispatchContext } from "../hooks/useQuizDispatchContext";

type CurrentQuestion = {
    id: number;
    question: string;
};

export default function QuizReady() {
    // Get the questionInstances(List of questions) and the dispatch function from the context provider
    const { questionInstances } = useQuizStateContext();
    const { quizDispatch } = useQuizDispatchContext();

    // Track the current question opened on the right side of the app when block clicked
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
