//MRamdani

import { useEffect, useReducer } from "react";

import Background from "./Background";
import Main from "./Main";
import Navigation from "./Navigation";
import QuizHome from "./QuizHome";
import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";
import type { QuizActionType } from "../utils/types/QuizActionType";
import { fetchJSON } from "../utils/api/fetchJSON";
import type { FormQueryType } from "../utils/types/FormQueryType";
import QuizReady from "./QuizReady";
import FadeInOut from "./animations/FadeInOut";
import Loading from "./Loading";
import ErrorBaloon from "./ErrorBaloon";
import QuizPlay from "./QuizPlay";
import QuizFinished from "./QuizFinished";
import type { QuizDataType } from "../utils/types/QuizDataType";

const initialQuizState: QuizStateType = {
    questionInstances: [],
    status: "home",
    query: null,
    error: null,
};

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

export default function App() {
    const [{ questionInstances, query, status, error }, quizDispatch] =
        useReducer(reducer, initialQuizState);

    useEffect(() => {
        if (!query) return;
        async function OpenTDBRequest() {
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
                quizDispatch({
                    type: "error",
                    payload: `Error when fetching quiz: ${err}`,
                });
            }
        }

        OpenTDBRequest();
    }, [query]);

    return (
        <>
            <Main>
                <Navigation />
                <FadeInOut
                    firstElement={true}
                    show={status === "home" || status === "error"}
                >
                    <QuizHome error={error} quizDispatch={quizDispatch} />
                </FadeInOut>
                <FadeInOut show={status === "loading"}>
                    <Loading />
                </FadeInOut>
                {status === "error" && (
                    <ErrorBaloon quizDispatch={quizDispatch}>
                        {error}
                    </ErrorBaloon>
                )}
                <FadeInOut show={status === "ready"}>
                    <QuizReady
                        quizDispatch={quizDispatch}
                        questionInstances={questionInstances}
                    />
                </FadeInOut>
                <FadeInOut show={status === "playing"}>
                    {questionInstances.length > 0 && (
                        <QuizPlay
                            quizDispatch={quizDispatch}
                            questionInstances={questionInstances}
                        />
                    )}
                </FadeInOut>
                <FadeInOut show={status === "finished"}>
                    <QuizFinished
                        questionInstances={questionInstances}
                        quizDispatch={quizDispatch}
                    />
                </FadeInOut>
            </Main>
            <Background />
        </>
    );
}
