import { useQuizDispatchContext } from "../../hooks/useQuizDispatchContext";

export default function ErrorBaloon({
    children,
}: {
    children: React.ReactNode;
}) {
    const { quizDispatch } = useQuizDispatchContext();

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
