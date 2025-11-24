import { useContext } from "react";
import { QuizDispatchContext } from "../contexts/QuizDispatchContext";

// Simple custom hook to check for in case the context is null.
export function useQuizDispatchContext() {
    const context = useContext(QuizDispatchContext);
    if (!context)
        throw new Error("QuizStateContext was used outside QuizProvider");
    return context;
}
