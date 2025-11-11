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
                <div className="select-wrapper">
                    <select required defaultValue="">
                        <option value="" disabled hidden></option>
                        <option value="Science">Science</option>
                        <option value="Nature">Nature</option>
                        <option value="Flower">Flower</option>
                    </select>
                    <label>Question Category</label>
                </div>
                <div className="select-wrapper">
                    <select required defaultValue="">
                        <option value="" disabled hidden></option>
                        <option value="Any">Any</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <label>Difficulty</label>
                </div>
                <div className="select-wrapper" id="type">
                    <select required defaultValue="">
                        <option value="" disabled hidden></option>
                        <option value="Any">Any</option>
                        <option value="Multiple">Multiple</option>
                        <option value="Boolean">Boolean</option>
                    </select>
                    <label>Question Type</label>
                </div>
                <div className="button-wrapper">
                    <button>Start Quiz</button>
                </div>
            </form>
        </div>
    );
}
