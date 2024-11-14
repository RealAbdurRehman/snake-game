import { useState, useEffect } from "react";

export default function ScoreDisplay({ score, increment }) {
    const [showScore, setShowScore] = useState(false);
    useEffect(() => {
        if (score > 0) {
            setShowScore(true);
            const timeout = setTimeout(() => {
                setShowScore(false);
            }, 1000)
            return () => clearTimeout(timeout);
        }
    }, [score])
    return (
        <section>
            <div className="score-display">
                <h2>Score:</h2>
                <h2 className="score">{score}</h2>
            </div>
            {showScore && <h2 className="score-increment">+{increment}</h2>}
        </section>
    )
}