import { useEffect, useReducer, useState } from "react";

import { isOneOfString } from "../utils/guards/isOneOfString";
import type { QuizActionType } from "../utils/types/QuizActionType";
import { fetchJSON } from "../utils/api/fetchJSON";

const initialFormState: InitialFormState = {
    numQuestion: undefined,
    questionCategory: undefined,
    questionDifficulty: undefined,
    questionType: undefined,
};

type openTDBCategory = {
    id: number;
    name: string;
};

type openTDBCategoryRes = {
    trivia_categories: openTDBCategory[];
};

type InitialFormState = {
    numQuestion: undefined | number;
    questionCategory: undefined | string;
    questionDifficulty: undefined | "any" | "hard" | "medium" | "easy";
    questionType: undefined | "any" | "multiple" | "boolean";
};

type Action =
    | { type: "input"; payload: number }
    | { type: "category"; payload: string }
    | { type: "difficulty"; payload: "any" | "hard" | "medium" | "easy" }
    | { type: "type"; payload: "any" | "multiple" | "boolean" }
    | { type: "reset" };

type QuizHomeProps = {
    quizDispatch: React.ActionDispatch<[action: QuizActionType]>;
    error: string | null;
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

export default function QuizHome({ quizDispatch, error }: QuizHomeProps) {
    const [
        { numQuestion, questionCategory, questionDifficulty, questionType },
        formDispatch,
    ] = useReducer(formReducer, initialFormState);
    const [categoryOptions, setCategoryOptions] = useState<
        openTDBCategory[] | null
    >(null);

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
