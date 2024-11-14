export default function GameOverScreen({ collidedWithWall, collidedWithSelf, initiateGame }) {
    return (
        <section className="game-over">
            <h1>GAME OVER</h1>
            <div className="game-over-reason">
                <h2>You hit {collidedWithWall ? "a wall" : collidedWithSelf ? "yourself" : "something unexpected"}</h2>
                <div className="exclamation">!</div>
            </div>
            <button onClick={initiateGame} className="new-game-btn">New Game?</button>
            <p className="tip"><span>Tip:</span> {collidedWithWall ? "Don't hit a wall." : collidedWithSelf ? "Don't hit yourself." : "Get better."}</p>
        </section>
    )
}