import { useContext } from "react";
import { QuizStateContext } from "../contexts/QuizStateContext";

// Simple custom hook to check for in case the context is null.
export function useQuizStateContext() {
    const context = useContext(QuizStateContext);
    if (!context)
        throw new Error("QuizStateContext was used outside QuizProvider");
    return context;
}
