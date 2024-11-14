import { useState } from "react";
import DisplayGrid from "./components/DisplayGrid";
import GameStatsAndSettings from "./components/GameStatsAndSettings";

export default function App() {
  const [score, setScore] = useState(0);
  const [scoreIncrement, setScoreIncrement] = useState(0);
  
  return (
    <main>
      <DisplayGrid setScore={setScore} setScoreIncrement={setScoreIncrement} score={score} />
      <GameStatsAndSettings score={score} scoreIncrement={scoreIncrement} />
    </main>
  )
}