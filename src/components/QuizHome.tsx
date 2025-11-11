export default function QuizHome() {
    return (
        <div className="quiz-home">
            <h1>Welcome to my trivia quiz app!</h1>
            <p>Tailor the quiz the way you want</p>
            <form>
                <div className="input-wrapper">
                    <input
                        required
                        type="number"
                        placeholder="Number of questions*"
                    />
                    <label>Number of questions*</label>
                </div>
                <select defaultValue="default">
                    <option value="default" disabled>
                        Question Category
                    </option>
                    <option value="">Science</option>
                    <option value="">Nature</option>
                    <option value="">Flower</option>
                </select>
                <select defaultValue="default">
                    <option value="default" disabled>
                        Difficulty
                    </option>
                    <option value="Any">Any</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <select defaultValue="default">
                    <option value="default" disabled>
                        Question Type
                    </option>
                    <option value="">Any</option>
                    <option value="">Multiple</option>
                    <option value="">Boolean</option>
                </select>
            </form>
            <button>Start Quiz</button>
        </div>
    );
}
