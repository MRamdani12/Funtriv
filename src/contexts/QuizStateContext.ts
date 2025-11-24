import { createContext } from "react";
import type { FormQueryType } from "../utils/types/FormQueryType";
import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";

type QuizStateContextType = {
    questionInstances: QuestionInstanceType[];
    status: "home" | "error" | "loading" | "ready" | "playing" | "finished";
    query: FormQueryType | null;
    error: string | null;
};

export const QuizStateContext = createContext<QuizStateContextType | null>(
    null
);
