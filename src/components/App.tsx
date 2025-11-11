import Background from "./Background";
import Main from "./Main";
import Navigation from "./Navigation";
import QuizHome from "./QuizHome";

export default function App() {
    return (
        <Main>
            <Navigation />
            <QuizHome />
            <Background />
        </Main>
    );
}
