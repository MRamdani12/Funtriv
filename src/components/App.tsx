import { useEffect, useReducer } from "react";
import Background from "./Background";
import Main from "./Main";
import Navigation from "./Navigation";
import QuizHome from "./QuizHome";
import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";
import type { QuizAction } from "../utils/types/QuizAction";
import { fetchJSON } from "../utils/api/fetchJSON";
import type { FormQueryType } from "../utils/types/FormQueryType";

const initialQuizState: QuizStateType = {
    questionInstance: [],
    status: "standBy",
    query: null,
};

type QuizStateType = {
    questionInstance: QuestionInstanceType[];
    status: "standBy" | "loading" | "ready" | "playing" | "finished";
    query: FormQueryType | null;
};

type OpenTDBResponse = {
    responseCode: number;
    results: QuestionInstanceType[];
};

function reducer(quizState: QuizStateType, action: QuizAction) {
    switch (action.type) {
        case "query":
            return { ...quizState, query: action.payload };
        case "dataReceived":
            return {
                ...quizState,
                questionInstance: action.payload.map((q) => {
                    return {
                        question: q.question,
                        correctAnswer: q.correctAnswer,
                        incorrectAnswers: q.incorrectAnswers,
                    };
                }),
            };
    }
}

export default function App() {
    const [{ questionInstance, query }, quizDispatch] = useReducer(
        reducer,
        initialQuizState
    );

    useEffect(() => {
        if (!query) return;
        async function OpenTDBRequest() {
            try {
                const data = await fetchJSON<OpenTDBResponse>(
                    `https://opentdb.com/api.php?amount=${query?.numQuestion}&difficulty=${query?.questionDifficulty}&type=${query?.questionType}`
                );
                console.log("run");
                quizDispatch({ type: "dataReceived", payload: data.results });
            } catch (err) {
                console.error(err);
            }
        }

        OpenTDBRequest();
        console.log(query);
    }, [query]);

    return (
        <Main>
            <Navigation />
            <QuizHome quizDispatch={quizDispatch} />
            <Background />
        </Main>
    );
}
