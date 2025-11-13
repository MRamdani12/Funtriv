import type { FormQueryType } from "./FormQueryType";
import type { QuizDataType } from "./QuizDataType";

export type QuizAction =
    | { type: "query"; payload: FormQueryType }
    | { type: "dataReceived"; payload: QuizDataType[] }
    | { type: "dataLoading" }
    | { type: "error"; payload: string }
    | { type: "home" };
