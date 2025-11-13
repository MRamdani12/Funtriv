import { useEffect, useReducer } from "react";

import Background from "./Background";
import Main from "./Main";
import Navigation from "./Navigation";
import QuizHome from "./QuizHome";
import type { QuestionInstanceType } from "../utils/types/QuestionInstanceType";
import type { QuizAction } from "../utils/types/QuizAction";
import { fetchJSON } from "../utils/api/fetchJSON";
import type { FormQueryType } from "../utils/types/FormQueryType";
import QuizReady from "./QuizReady";
import FadeInOut from "./animations/FadeInOut";
import Loading from "./Loading";
import ErrorBaloon from "./ErrorBaloon";
import QuizPlay from "./QuizPlay";

const initialQuizState: QuizStateType = {
    questionInstances: [],
    status: "playing",
    query: null,
    error: null,
};

// const mockData: QuestionInstanceType[] = [
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
//     {
//         question:
//             "Who was the villain of &#039;&#039;The Lion King&#039;&#039;?",
//         correctAnswer: "Scar",
//         incorrectAnswers: ["Fred", "Jafar", "Vada"],
//     },
//     {
//         question: "What is the capital of Vietnam?",
//         correctAnswer: "Hanoi",
//         incorrectAnswers: ["Da Nang", "Hai Phong", "Ho Chi Minh City"],
//     },
//     {
//         question:
//             "In the 1993 Disney animated series &quot;Bonkers&quot;, what is the name of Bonker&#039;s second partner?",
//         correctAnswer: "Miranda Wright",
//         incorrectAnswers: [
//             "Dick Tracy",
//             "Eddie Valiant",
//             "Dr. Ludwig von Drake",
//         ],
//     },
//     {
//         question:
//             "Which one of these characters was first introduced in Sonic Boom: Rise of Lyric?",
//         correctAnswer: "Sticks the Badger",
//         incorrectAnswers: [
//             "Mighty the Armadillo",
//             "Espio the Chameleon",
//             "Rouge the Bat",
//         ],
//     },
// ];

type QuizStateType = {
    questionInstances: QuestionInstanceType[];
    status: "home" | "error" | "loading" | "ready" | "playing" | "finished";
    query: FormQueryType | null;
    error: string | null;
};

type OpenTDBResponse = {
    response_code: number;
    results: QuestionInstanceType[];
};

function reducer(quizState: QuizStateType, action: QuizAction): QuizStateType {
    switch (action.type) {
        case "query":
            return { ...quizState, query: action.payload };
        case "dataReceived":
            return {
                ...quizState,
                questionInstances: action.payload.map((q) => {
                    return {
                        question: decodeURIComponent(q.question),
                        correctAnswer: q.correctAnswer,
                        incorrectAnswers: q.incorrectAnswers,
                    };
                }),
                status: "ready",
            };
        case "dataLoading":
            return { ...quizState, status: "loading" };
        case "error":
            return { ...quizState, error: action.payload, status: "error" };
        case "home":
            return { ...quizState, status: "home" };
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
            <Background />
            <FadeInOut show={status === "error"}>
                <ErrorBaloon>{error}</ErrorBaloon>
            </FadeInOut>
            <FadeInOut show={status === "ready"}>
                <QuizReady questionInstances={questionInstances} />
            </FadeInOut>
            <FadeInOut show={status === "playing"}>
                <QuizPlay questionInstances={questionInstances} />
            </FadeInOut>
        </Main>
    );
}
