import type { QuizActionType } from "../utils/types/QuizActionType";

export default function ErrorBaloon({
    children,
    quizDispatch,
}: {
    children: React.ReactNode;
    quizDispatch: React.Dispatch<QuizActionType>;
}) {
    return (
        <div className="error">
            {children}
            <button
                onClick={() => quizDispatch({ type: "closeError" })}
                className="close-error"
            >
                X
            </button>
        </div>
    );
}
