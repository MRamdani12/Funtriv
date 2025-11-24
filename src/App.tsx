//MRamdani

import Background from "./components/ui/Background";
import Main from "./components/ui/Main";
import Navigation from "./components/ui/Navigation";
import QuizHome from "./components//QuizHome";

import QuizReady from "./components//QuizReady";
import FadeInOut from "./components//animations/FadeInOut";
import Loading from "./components/ui/Loading";
import ErrorBaloon from "./components/ui/ErrorBaloon";
import QuizPlay from "./components//QuizPlay";
import QuizFinished from "./components//QuizFinished";
import { useQuizStateContext } from "./hooks/useQuizStateContext";

export default function App() {
    const { status, error } = useQuizStateContext();

    return (
        <>
            <Main>
                <Navigation />
                <FadeInOut
                    firstElement={true}
                    show={status === "home" || status === "error"}
                >
                    <QuizHome />
                </FadeInOut>
                <FadeInOut show={status === "loading"}>
                    <Loading />
                </FadeInOut>
                {status === "error" && <ErrorBaloon>{error}</ErrorBaloon>}
                <FadeInOut show={status === "ready"}>
                    <QuizReady />
                </FadeInOut>
                <FadeInOut show={status === "playing"}>
                    <QuizPlay />
                </FadeInOut>
                <FadeInOut show={status === "finished"}>
                    <QuizFinished />
                </FadeInOut>
            </Main>
            <Background />
        </>
    );
}
