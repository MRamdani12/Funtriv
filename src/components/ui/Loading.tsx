import { LoadAnimation } from "../animations/LoadingAnimation";

export default function Loading() {
    return (
        <div className="loading">
            <p>Loading Quiz...</p>

            <LoadAnimation />
        </div>
    );
}
