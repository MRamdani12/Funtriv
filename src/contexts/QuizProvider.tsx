import { useEffect, useReducer } from "react";

import type { FormQueryType } from "../utils/types/FormQueryType";
import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";
import type { QuizActionType } from "../utils/types/QuizActionType";
import type { QuizDataType } from "../utils/types/QuizDataType";
import { fetchJSON } from "../utils/api/fetchJSON";
import { QuizStateContext } from "./QuizStateContext";
import { QuizDispatchContext } from "./QuizDispatchContext";

// Creating types for QuizState and API response
type QuizStateType = {
    questionInstances: QuestionInstanceType[];
    status: "home" | "error" | "loading" | "ready" | "playing" | "finished";
    query: FormQueryType | null;
    error: string | null;
};

type OpenTDBResponse = {
    response_code: number;
    results: QuizDataType[];
};

// Creating initial state for reducer
const initialQuizState: QuizStateType = {
    questionInstances: [],
    status: "home",
    query: null,
    error: null,
};

function reducer(
    quizState: QuizStateType,
    action: QuizActionType
): QuizStateType {
    switch (action.type) {
        case "query":
            return { ...quizState, query: action.payload };
        case "dataReceived":
            return {
                ...quizState,
                questionInstances: action.payload.map((q) => {
                    // Decode/convert the string this reducer get from the API.
                    return {
                        question: decodeURIComponent(q.question),
                        correctAnswer: decodeURIComponent(q.correct_answer),
                        incorrectAnswers: q.incorrect_answers.map((incorrect) =>
                            decodeURIComponent(incorrect)
                        ),
                    };
                }),
                status: "ready",
            };
        case "dataLoading":
            return { ...quizState, status: "loading" };
        case "startQuiz":
            return { ...quizState, status: "playing" };
        case "submitAnswer":
            return {
                // Update the questionInstances with the user answer
                ...quizState,
                questionInstances: quizState.questionInstances.map((q, i) => {
                    if (i === action.payload.index) {
                        return { ...q, userAnswer: action.payload.answer };
                    } else {
                        return q;
                    }
                }),
            };
        case "error":
            return { ...quizState, error: action.payload, status: "error" };
        case "closeError":
            return { ...quizState, status: "home", error: null };
        case "home":
            return { ...quizState, status: "home" };
        case "finished":
            return { ...quizState, status: "finished" };
        case "restartQuiz":
            return initialQuizState;
    }
}

export default function QuizProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [{ questionInstances, query, status, error }, quizDispatch] =
        useReducer(reducer, initialQuizState);

    useEffect(() => {
        if (!query) return;
        async function OpenTDBRequest() {
            // Fetching API from openTDB with all the options from the form on QuizHome components
            quizDispatch({ type: "dataLoading" });
            try {
                const data = await fetchJSON<OpenTDBResponse>(
                    `https://opentdb.com/api.php?amount=${query?.numQuestion}&${
                        query?.questionCategory === "any"
                            ? ""
                            : `category=${query?.questionCategory}`
                    }&${
                        query?.questionDifficulty === "any"
                            ? ""
                            : `difficulty=${query?.questionDifficulty}`
                    }&${
                        query?.questionType === "any"
                            ? ""
                            : `type=${query?.questionType}`
                    }&encode=url3986`
                );

                // Handle the error according to openTDB error.
                if (data.response_code) {
                    if (data.response_code === 1) {
                        throw new Error(
                            `No Results, it's most likely you request for too many questions but the API doesn't have enough (Ex. Asking for 50 Questions in a Category that only has 20.)`
                        );
                    } else {
                        throw new Error(
                            `Error Code ${data.response_code}: For more information, visit https://opentdb.com/api_config.php`
                        );
                    }
                }
                quizDispatch({ type: "dataReceived", payload: data.results });
            } catch (err) {
                // Handle the more generic error
                quizDispatch({
                    type: "error",
                    payload: `Error when fetching quiz: ${err}`,
                });
            }
        }

        OpenTDBRequest();
    }, [query]);

    return (
        // Splitting the state and dispatch context for a little optimization
        <QuizStateContext value={{ questionInstances, query, status, error }}>
            <QuizDispatchContext value={{ quizDispatch }}>
                {children}
            </QuizDispatchContext>
        </QuizStateContext>
    );
}
