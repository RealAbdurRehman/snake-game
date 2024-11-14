import { useState, useEffect } from "react";
import useSpawnFood from "../hooks/useSpawnFood";
import GameOverScreen from "./GameOverScreen";
import eyeDead from '../assets/eye-dead.png';

export default function DisplayGrid({ setScore, setScoreIncrement, score }) {
  const rows = 35;
  const columns = 60;

  const [startGame, setStartGame] = useState(true);
  function startGameFunc() {
    setStartGame(false);
    newGame();
  }

  const [snake, setSnake] = useState([
    {row: 15, col: 30},
    {row: 15, col: 29},
    {row: 15, col: 28}
  ])
  const [snakeDirection, setSnakeDirection] = useState("RIGHT");
  const [moveSpeed, setMoveSpeed] = useState(70);

  const [grid, setGrid] = useState([]);
  const [isFood, setIsFood] = useState(false);
  const [isBigFood, setIsBigFood] = useState(false);
  const [isSnake, setIsSnake] = useState(false);
  const [isSnakeHead, setIsSnakeHead] = useState(false);
  const [spawnFood, setSpawnFood] = useState();

  const [shake, setShake] = useState(false);
  const [hitWall, setHitWall] = useState(false);
  const [hitSelf, setHitSelf] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  function gameOverSequence() {
    window.removeEventListener("keydown", handleKeyDown);
  }

  useEffect(() => {
    if (hitWall || hitSelf) {
      setShake(true);
    }
    const timeout = setTimeout(() => {
      setShake(false)
    }, 200)
    return () => clearTimeout(timeout);
  }, [hitWall, hitSelf])

  function newGame() {
    setSnake([
      { row: 15, col: 30 },
      { row: 15, col: 29 },
      { row: 15, col: 28 }
    ])
    setSnakeDirection("RIGHT");
    setMoveSpeed(70);
  
    setHitWall(false);
    setHitSelf(false);
    setGameOver(false);
  
    setScore(0);
    setScoreIncrement(0);
    const newGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push({
          id: `${i}-${j}`,
          isFood: false,
          isBigFood: false,
          isSnake: false,
          isSnakeHead: false
        })
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setSpawnFood(prevSpawnFood => !prevSpawnFood);
  }

  useEffect(() => {
    if (!startGame) {
      function createGrid(rows, cols) {
        const newGrid = [];
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let j = 0; j < cols; j++) {
            row.push({ id: `${i}-${j}`, isFood: isFood, isBigFood: isBigFood, isSnake: isSnake, isSnakeHead: isSnakeHead });
          }
          newGrid.push(row);
        } 
        setGrid(newGrid);
      }
    createGrid(rows, columns);
    }
  }, [columns, rows])

  useSpawnFood(grid, setGrid, spawnFood, setSpawnFood);

  useEffect(() => {
    if (startGame) return;
    const interval = setInterval(() => {
      moveSnake();
    }, moveSpeed);
    return () => clearInterval(interval);
  }, [snake, snakeDirection, moveSpeed])

  function handleKeyDown(event) {
    if (gameOver) return;
    switch (event.key) {
      case "ArrowUp":
      case "w":
      case "W":
        if (snakeDirection !== "DOWN") setSnakeDirection("UP");
        break;
      case "ArrowDown":
      case "s":
      case "S":
        if (snakeDirection !== "UP") setSnakeDirection("DOWN");
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        if (snakeDirection !== "RIGHT") setSnakeDirection("LEFT");
        break;
      case "ArrowRight":
      case "d":
      case "D":
        if (snakeDirection !== "LEFT") setSnakeDirection("RIGHT");
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [snakeDirection]);

  useEffect(() => {
    if (gameOver) {
      gameOverSequence();
    }
  }, [gameOver, gameOverSequence])

  function moveSnake() {
    if (gameOver || startGame) return;
    const newSnake = [...snake];
    const head = newSnake[0];
    let newHead;  
    switch (snakeDirection) {
      case "UP":
        newHead = { row: head.row - 1, col: head.col };
        break;
      case "DOWN":
        newHead = { row: head.row + 1, col: head.col };
        break;
      case "LEFT":
        newHead = { row: head.row, col: head.col - 1 };
        break;
      case "RIGHT":
        newHead = { row: head.row, col: head.col + 1 };
        break;
      default:
        return;
    }
    if (
      newHead.row < 0 || newHead.row >= rows ||
      newHead.col < 0 || newHead.col >= columns
    ) {
      setHitSelf(false);
      setHitWall(true);
      setGameOver(true);
      return;
    }
    if (newSnake.some((segment) => segment.row === newHead.row && segment.col === newHead.col)) {
      setHitWall(false);
      setHitSelf(true);
      setGameOver(true);
      return;
    }
    newSnake.unshift(newHead);
    if (grid.length > 0 && grid[newHead.row] && grid[newHead.row][newHead.col]) {
      const foodCell = grid[newHead.row][newHead.col];
      if (foodCell.isFood || foodCell.isBigFood) {
        setSpawnFood(prevSpawnFood => !prevSpawnFood);
      } 
      if (foodCell.isFood) {
        foodCell.isFood = false;
        const increment = Math.floor(Math.random() * 10) + 1;
        setScoreIncrement(increment);
        setScore(prevScore => increment + prevScore);
        setGrid([...grid]);
      } else if (foodCell.isBigFood) {
        foodCell.isBigFood = false;
        const increment = Math.floor(Math.random() * 100) + 10;
        setScoreIncrement(increment);
        setScore(prevScore => increment + prevScore);
        setGrid([...grid]);
      } else {
        newSnake.pop();
      }
    }
    setSnake(newSnake);
  }

  const gridElements = grid && Array.isArray(grid) && grid.length > 0 ? grid.map(row => {
    return row.map(column => {
      const isSnakeSegment = snake.some(segment => segment.row === parseInt(column.id.split("-")[0]) && segment.col === parseInt(column.id.split("-")[1]));
      const isSnakeHead = snake[0].row === parseInt(column.id.split("-")[0]) && snake[0].col === parseInt(column.id.split("-")[1]);

      return (
        <div
          key={column.id}
          className={`grid-cell ${column.isFood ? "small-food" : column.isBigFood ? "big-food" : ""} 
          ${isSnakeSegment ? "snake" : ""} ${gameOver && isSnakeSegment ? "blink" : ""}`}
        >
          {isSnakeHead && 
            <div className="eyes">
              <div className="eye">
                {gameOver ? <img className="eye-dead" src={eyeDead} alt="Dead Eye" /> : <div className="eyeball"></div>}
              </div>
              <div className="eye">
                {gameOver ? <img className="eye-dead" src={eyeDead} alt="Dead Eye" /> : <div className="eyeball"></div>}
              </div>
            </div>}
        </div>
      );
    });
  }).flat() : [];
  const gridStyles = {
    display: "grid",
    gridTemplateRows: `repeat(${rows}, 25px)`,
    gridTemplateColumns: `repeat(${columns}, 25px)`
  }
  return (
    <>
      {!startGame ? 
        <div className={`main-game ${shake ? "shake" : ""}`}>
          <section className="grid-section" style={gridStyles}>
            {gridElements}
          </section>
        </div> 
      : 
        <section className="start-game-section">
          <h2 className="start-game">Click <span>"Start Game" </span>to start a game!</h2>
          <button className="start-game-btn" onClick={startGameFunc}>Start Game?</button>
        </section>
      }
      {gameOver && <GameOverScreen collidedWithWall={hitWall} collidedWithSelf={hitSelf} initiateGame={newGame} score={score} />}
    </>
  )
}