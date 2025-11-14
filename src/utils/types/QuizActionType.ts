import type { FormQueryType } from "./FormQueryType";
import type { QuizDataType } from "./QuizDataType";

export type QuizActionType =
    | { type: "query"; payload: FormQueryType }
    | { type: "dataReceived"; payload: QuizDataType[] }
    | { type: "dataLoading" }
    | { type: "startQuiz" }
    | { type: "submitAnswer"; payload: { index: number; answer: string } }
    | { type: "error"; payload: string }
    | { type: "closeError" }
    | { type: "home" }
    | { type: "finished" }
    | { type: "restartQuiz" };
