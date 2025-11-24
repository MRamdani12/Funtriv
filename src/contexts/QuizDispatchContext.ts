import { createContext } from "react";
import type { QuizActionType } from "../utils/types/QuizActionType";

type QuizDispatchContextType = {
    quizDispatch: React.Dispatch<QuizActionType>;
};

export const QuizDispatchContext =
    createContext<QuizDispatchContextType | null>(null);
