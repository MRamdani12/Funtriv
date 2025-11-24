import { useEffect, useReducer, useState } from "react";

import { isOneOfString } from "../utils/guards/isOneOfString";
import { fetchJSON } from "../utils/api/fetchJSON";
import { useQuizStateContext } from "../hooks/useQuizStateContext";
import { useQuizDispatchContext } from "../hooks/useQuizDispatchContext";

// Create all the necessary types for the form.

// Type for the question category
type openTDBCategory = {
    id: number;
    name: string;
};

// Type for the question category the API returned
type openTDBCategoryRes = {
    trivia_categories: openTDBCategory[];
};

// Type of initial form state
type InitialFormState = {
    numQuestion: undefined | number;
    questionCategory: undefined | string;
    questionDifficulty: undefined | "any" | "hard" | "medium" | "easy";
    questionType: undefined | "any" | "multiple" | "boolean";
};

// Type of reducer action on the form
type Action =
    | { type: "input"; payload: number }
    | { type: "category"; payload: string }
    | { type: "difficulty"; payload: "any" | "hard" | "medium" | "easy" }
    | { type: "type"; payload: "any" | "multiple" | "boolean" }
    | { type: "reset" };

const initialFormState: InitialFormState = {
    numQuestion: undefined,
    questionCategory: undefined,
    questionDifficulty: undefined,
    questionType: undefined,
};

function formReducer(formState: InitialFormState, action: Action) {
    switch (action.type) {
        case "input":
            return { ...formState, numQuestion: action.payload };
        case "category":
            return { ...formState, questionCategory: action.payload };
        case "difficulty":
            return { ...formState, questionDifficulty: action.payload };
        case "type":
            return { ...formState, questionType: action.payload };
        case "reset":
            return { ...initialFormState };
        default:
            throw new Error("Action Unknown");
    }
}

export default function QuizHome() {
    // Getting the error and dispatch value from context provider
    const { error } = useQuizStateContext();
    const { quizDispatch } = useQuizDispatchContext();

    const [
        { numQuestion, questionCategory, questionDifficulty, questionType },
        formDispatch,
    ] = useReducer(formReducer, initialFormState);

    const [categoryOptions, setCategoryOptions] = useState<
        openTDBCategory[] | null
    >(null);

    // Fetching the question category from openTDB
    useEffect(() => {
        async function getCategory() {
            try {
                const data = await fetchJSON<openTDBCategoryRes>(
                    "https://opentdb.com/api_category.php"
                );
                setCategoryOptions(data.trivia_categories);
            } catch (err) {
                quizDispatch({
                    type: "error",
                    payload: `Error when fetching quiz category:
                     ${String(err)}`,
                });
            }
        }

        getCategory();
    }, [quizDispatch]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        formDispatch({ type: "reset" });

        // Make sure if the form fields is not empty since typescript can't detect required property on HTML.
        if (
            numQuestion &&
            questionCategory &&
            questionDifficulty &&
            questionType
        ) {
            quizDispatch({
                type: "query",
                payload: {
                    numQuestion: numQuestion,
                    questionCategory: questionCategory,
                    questionDifficulty: questionDifficulty,
                    questionType: questionType,
                },
            });
        }
    }

    return (
        <div className="quiz-home">
            <h1>Welcome to my trivia quiz app!</h1>
            <p>Tailor the quiz the way you want</p>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="input-wrapper">
                    <input
                        onChange={(e) =>
                            formDispatch({
                                type: "input",
                                payload: Number(e.target.value),
                            })
                        }
                        value={numQuestion ? numQuestion : ""}
                        required
                        type="number"
                        placeholder="Number of questions*"
                        min={1}
                        max={50}
                    />
                    <label>Number of questions (max 50)*</label>
                </div>
                <div className="select-wrapper">
                    <select
                        onChange={(e) =>
                            formDispatch({
                                type: "category",
                                payload: e.target.value,
                            })
                        }
                        value={questionCategory ? questionCategory : ""}
                        required
                    >
                        <option value="" disabled hidden></option>
                        {error && !categoryOptions && (
                            <option disabled>{error}</option>
                        )}
                        {!categoryOptions && !error && (
                            <option disabled>Loading...</option>
                        )}
                        {categoryOptions &&
                            categoryOptions
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((c) => {
                                    return (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    );
                                })}
                    </select>
                    <label>Question Category*</label>
                </div>
                <div className="select-wrapper">
                    <select
                        onChange={(e) => {
                            // Some typeguard for difficulty options
                            const diffulty = [
                                "any",
                                "hard",
                                "medium",
                                "easy",
                            ] as const;
                            if (isOneOfString(e.target.value, diffulty))
                                formDispatch({
                                    type: "difficulty",
                                    payload: e.target.value,
                                });
                        }}
                        value={questionDifficulty ? questionDifficulty : ""}
                        required
                    >
                        <option value="" disabled hidden></option>
                        <option value="any">Any</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <label>Difficulty*</label>
                </div>
                <div className="select-wrapper" id="type">
                    <select
                        onChange={(e) => {
                            // Another typeguard for question type options
                            const diffulty = [
                                "any",
                                "multiple",
                                "boolean",
                            ] as const;
                            if (isOneOfString(e.target.value, diffulty))
                                formDispatch({
                                    type: "type",
                                    payload: e.target.value,
                                });
                        }}
                        value={questionType ? questionType : ""}
                        required
                    >
                        <option value="" disabled hidden></option>
                        <option value="any">Any</option>
                        <option value="multiple">Multiple</option>
                        <option value="boolean">Boolean</option>
                    </select>
                    <label>Question Type*</label>
                </div>
                <div className="button-wrapper">
                    <button type="submit">Fetch Quiz</button>
                </div>
            </form>
        </div>
    );
}
