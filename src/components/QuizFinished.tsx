import { useEffect, useRef, useState } from "react";
import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";
import type { QuizActionType } from "../utils/types/QuizActionType";
import Block from "./Block";
import Background from "./Background";

type QuizFinishedProps = {
    questionInstances: QuestionInstanceType[];
    quizDispatch: React.Dispatch<QuizActionType>;
};

export default function QuizFinished({
    questionInstances,
    quizDispatch,
}: QuizFinishedProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const timeout = useRef(0);

    const question = questionInstances[currentQuestion];
    const questionOptions = [
        question.correctAnswer,
        ...question.incorrectAnswers,
    ].sort((a, b) => b.localeCompare(a));
    const isAnsweredCorrectly = question.correctAnswer === question.userAnswer;
    const totalCorrectAnswer = questionInstances.filter(
        (q) => q.correctAnswer === q.userAnswer
    ).length;
    const correctAnswerPercentage = Math.round(
        (totalCorrectAnswer / questionInstances.length) * 100
    );

    useEffect(() => {
        return () => clearTimeout(timeout.current);
    }, []);

    function handleModal(index: number) {
        setModalOpen(!modalOpen);
        setCurrentQuestion(index);
    }

    return (
        <>
            {modalOpen && (
                <div className="modal">
                    <div
                        onClick={() => setModalOpen(!modalOpen)}
                        className="modal-outside"
                    ></div>
                    <button
                        onClick={() => setModalOpen(!modalOpen)}
                        className="close-button"
                    >
                        x
                    </button>
                    <div className="modal-content">
                        <Background />
                        <h2>{question.question}</h2>
                        <p>
                            {isAnsweredCorrectly
                                ? "You answered correctly"
                                : "Correct Answer"}
                        </p>
                        <button className="correct" disabled>
                            <span className="quiz-options-letter">
                                <p style={{ color: "black" }}>
                                    {String.fromCharCode(
                                        65 +
                                            questionOptions.findIndex(
                                                (q) =>
                                                    q === question.correctAnswer
                                            )
                                    )}
                                </p>
                                <Block
                                    bgColor={
                                        question.userAnswer
                                            ? "white"
                                            : "currentColor"
                                    }
                                />
                            </span>
                            {question.correctAnswer}
                        </button>
                        {!isAnsweredCorrectly && (
                            <>
                                <p>Your Answer</p>
                                <button
                                    style={{
                                        justifyContent: question.userAnswer
                                            ? "start"
                                            : "center",
                                    }}
                                    className="incorrect"
                                    disabled
                                >
                                    {question.userAnswer && (
                                        <span className="quiz-options-letter">
                                            <p style={{ color: "black" }}>
                                                {String.fromCharCode(
                                                    65 +
                                                        questionOptions.findIndex(
                                                            (q) =>
                                                                q ===
                                                                question.userAnswer
                                                        )
                                                )}
                                            </p>
                                            <Block
                                                bgColor={
                                                    question.userAnswer
                                                        ? "white"
                                                        : "currentColor"
                                                }
                                            />
                                        </span>
                                    )}

                                    {question.userAnswer
                                        ? question.userAnswer
                                        : "You didn't answer the question :("}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="quiz-finished">
                <h2>
                    Finished! You got {totalCorrectAnswer} correct answer
                    {totalCorrectAnswer === 1 ? "" : "s"} out of{" "}
                    {questionInstances.length} question
                    {questionInstances.length === 1 ? "" : "s"}
                </h2>
                <div className="quiz-grid">
                    {questionInstances.map((q, i) => {
                        return (
                            <button
                                key={q.question}
                                className="quiz-item"
                                onClick={() => handleModal(i)}
                            >
                                <p>
                                    {i + 1 < 10 && "0"}
                                    {i + 1}
                                </p>
                                <Block
                                    bgColor={
                                        q.correctAnswer === q.userAnswer
                                            ? "#23c072"
                                            : "#e03939"
                                    }
                                />
                            </button>
                        );
                    })}
                </div>
                <h3>
                    {" "}
                    {correctAnswerPercentage >= 90 && " 〵(^ o ^)〴"}
                    {correctAnswerPercentage <= 89 &&
                        correctAnswerPercentage >= 70 &&
                        " \\ (•◡•) /"}
                    {correctAnswerPercentage <= 69 &&
                        correctAnswerPercentage >= 50 &&
                        " 〘ఠ ╭╮ ఠ〙"}
                    {correctAnswerPercentage <= 49 &&
                        correctAnswerPercentage >= 10 &&
                        " (ಥ﹏ಥ)"}
                    {correctAnswerPercentage <= 9 && "ಠ_ಠ"}
                    <br />
                    Your score is {correctAnswerPercentage}%
                </h3>
                <div className="custom-progress">
                    <div
                        className="value"
                        style={{ width: `${correctAnswerPercentage}%` }}
                    ></div>
                    <div className="track"></div>
                </div>
                <button
                    onClick={() => {
                        quizDispatch({ type: "home" });
                        timeout.current = setTimeout(
                            () => quizDispatch({ type: "restartQuiz" }),
                            310
                        );
                    }}
                >
                    Restart Quiz
                </button>
            </div>
        </>
    );
}
