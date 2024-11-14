import ScoreDisplay from "./ScoreDisplay";

export default function GameStatsAndSettings({ score, scoreIncrement}) {
    return (
        <section className="settings-and-stats">
           <h1>Snake_game</h1>
           <ScoreDisplay score={score} increment={scoreIncrement} />
            <section className="controls-section">
                <div className="wasd">
                    <div className="wasd-container">
                        <div className="button" id="w">W</div>
                        <div className="flex">
                            <div className="button" id="a">A</div>
                            <div className="button" id="s">S</div>
                            <div className="button" id="d">D</div>
                        </div>
                    </div>
                    <div className="text">TO MOVE</div>
                </div>
                <div className="text or">OR</div>
                <div className="arrow-keys">
                    <div className="arrow-keys-container">
                        <div className="button" id="up">↑</div>
                        <div className="arrow-row">
                            <div className="button" id="left">←</div>
                            <div className="button" id="down">↓</div>
                            <div className="button" id="right">→</div>
                        </div>
                    </div>
                    <div className="text">TO MOVE</div>
                </div>
            </section>
        </section>
    )
}