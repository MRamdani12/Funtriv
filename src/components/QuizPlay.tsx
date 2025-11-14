import { useEffect, useState } from "react";

import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";
import Block from "./Block";
import type { QuizActionType } from "../utils/types/QuizActionType";

type QuizPlayProps = {
    questionInstances: QuestionInstanceType[];
    quizDispatch: React.Dispatch<QuizActionType>;
};

// Time to answer one question (30s)
const SECS_PER_QUESTION = 30;

export default function QuizPlay({
    questionInstances,
    quizDispatch,
}: QuizPlayProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(
        questionInstances.length * SECS_PER_QUESTION
    );

    const question = questionInstances[currentQuestion];
    const questionOptions = [
        question.correctAnswer,
        ...question.incorrectAnswers,
    ].sort((a, b) => b.localeCompare(a));

    const totalQuestions = questionInstances.length;
    const totalUserAnswered = questionInstances.filter(
        (q) => q.userAnswer
    ).length;
    const totalUserAnsweredPercentage = Math.round(
        (totalUserAnswered / totalQuestions) * 100
    );
    const min = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    useEffect(() => {
        if (secondsRemaining === 0) {
            quizDispatch({ type: "finished" });
            return;
        }

        const tick = setTimeout(() => setSecondsRemaining((s) => s - 1), 1000);

        return () => clearTimeout(tick);
    }, [quizDispatch, secondsRemaining]);

    return (
        <div className="quiz-play">
            <div className="quiz-question">
                <h2>{question.question}</h2>
                <div className="quiz-options">
                    {questionOptions.map((option, i) => {
                        const correct = question.correctAnswer === option;
                        const currentAnswer = question.userAnswer === option;
                        let buttonBgClass = "";
                        if (question.userAnswer) {
                            if (currentAnswer) {
                                if (correct) {
                                    buttonBgClass = "correct";
                                } else {
                                    buttonBgClass = "incorrect";
                                }
                            } else {
                                if (correct) buttonBgClass = "correct";
                            }
                        }

                        return (
                            <button
                                key={option}
                                className={buttonBgClass}
                                disabled={question.userAnswer ? true : false}
                                style={{
                                    transform: currentAnswer
                                        ? "translateX(20px)"
                                        : "",
                                    pointerEvents: question.userAnswer
                                        ? "none"
                                        : "auto",
                                }}
                                onClick={() => {
                                    quizDispatch({
                                        type: "submitAnswer",
                                        payload: {
                                            index: currentQuestion,
                                            answer: option,
                                        },
                                    });
                                }}
                            >
                                <span className="quiz-options-letter">
                                    <p
                                        style={{
                                            color: question.userAnswer
                                                ? "black"
                                                : "",
                                        }}
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </p>
                                    <Block
                                        bgColor={
                                            question.userAnswer
                                                ? "white"
                                                : "currentColor"
                                        }
                                    />
                                </span>
                                {option}
                            </button>
                        );
                    })}
                    {question.userAnswer && (
                        <>
                            <div
                                className="quiz-play-button-wrapper"
                                style={{ opacity: "1" }}
                            >
                                {currentQuestion !== 0 &&
                                    currentQuestion + 1 !== totalQuestions && (
                                        <button
                                            onClick={() =>
                                                setCurrentQuestion((i) => i - 1)
                                            }
                                            className="previous-button"
                                        >
                                            &lt; Previous Question
                                        </button>
                                    )}

                                {currentQuestion >= 0 &&
                                    currentQuestion + 1 !== totalQuestions && (
                                        <button
                                            onClick={() =>
                                                setCurrentQuestion((i) => i + 1)
                                            }
                                            className="previous-button"
                                        >
                                            Next Question &gt;
                                        </button>
                                    )}

                                {currentQuestion + 1 === totalQuestions &&
                                    totalUserAnswered === totalQuestions && (
                                        <button
                                            onClick={() =>
                                                quizDispatch({
                                                    type: "finished",
                                                })
                                            }
                                            className="next-button"
                                        >
                                            Finish Quiz
                                        </button>
                                    )}

                                {currentQuestion + 1 === totalQuestions &&
                                    totalUserAnswered !== totalQuestions && (
                                        <button
                                            onClick={() =>
                                                setCurrentQuestion((i) => i - 1)
                                            }
                                            className="next-button"
                                        >
                                            &lt; Answer all questions before
                                            finishing
                                        </button>
                                    )}
                            </div>
                            <p>You answered {question.userAnswer}</p>
                        </>
                    )}
                </div>
            </div>
            <div className="quiz-progress-container">
                <p>Click on the block to switch question</p>
                <div className="quiz-grid">
                    {questionInstances.map((q, i) => {
                        let svgBgColor: string = "currentColor";

                        if (q.userAnswer) {
                            if (q.correctAnswer === q.userAnswer) {
                                svgBgColor = "#23c072";
                            } else {
                                svgBgColor = "#e03939";
                            }
                        }

                        const opacity = q.userAnswer ? "0.5" : "0.2";

                        return (
                            <button
                                onClick={() => setCurrentQuestion(i)}
                                style={{
                                    opacity:
                                        currentQuestion === i ? "1" : opacity,
                                    transform:
                                        currentQuestion === i
                                            ? "translateY(-5px)"
                                            : "translateY(0px)",
                                }}
                                key={i}
                                className="quiz-item"
                            >
                                <p style={{ color: q.userAnswer && "white" }}>
                                    {i + 1 < 10 && "0"}
                                    {i + 1}
                                </p>
                                <Block bgColor={svgBgColor} />
                            </button>
                        );
                    })}
                </div>
                <div className="quiz-progress-wrapper">
                    <div className="quiz-data">
                        <p className="quiz-progress">
                            Question {currentQuestion + 1} of {totalQuestions}
                        </p>
                        <p className="quiz-progress">
                            {totalUserAnsweredPercentage}%
                        </p>
                    </div>
                    <progress max={totalQuestions} value={totalUserAnswered} />
                    <div className="quiz-data">
                        <p className="quiz-progress">
                            You answered {totalUserAnswered} question(s)
                        </p>
                        <p className="quiz-progress">
                            {min < 10 ? `0${min}` : min}:
                            {seconds < 10 ? `0${seconds}` : seconds}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
