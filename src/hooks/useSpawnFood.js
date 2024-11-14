import { useEffect } from "react";

export default function useSpawnFood(grid, setGrid, spawnFood, setSpawnFood) {
    useEffect(() => {
        setSpawnFood(prevSpawnFood => !prevSpawnFood);
    }, [])
    useEffect(() => {
        if (!grid || grid.length === 0) {
            return;
        }
        const randomCell = getRandomCell(grid);
        foodSpawner(randomCell, setGrid);
    }, [spawnFood])

    function getRandomIndex(array) {
        return Math.floor(Math.random() * array.length);
    }
    
    function getRandomCell(grid) {
        const randomRow = grid[getRandomIndex(grid)];
        return randomRow[getRandomIndex(randomRow)];
    }

    function deepCopyGrid(grid) {
        return grid.map(row => row.map(cell => ({...cell})));
    }
    
    function foodSpawner(cell, setGridFunc) {
        if (cell.isSnake || cell.isFood || cell.isBigFood) {
            const randomCell = getRandomCell(grid);
            foodSpawner(randomCell, setGridFunc);
        } else {
            const updatedGrid = deepCopyGrid(grid);
            const foodType = Math.random() > 0.7 ? "bigFood" : "smallFood";
            updateGrid(cell, updatedGrid, setGridFunc, foodType);
        }
    }

    function updateGrid(cell, updatedGrid, setGridFunc, foodType) {
        const [rowIndex, colIndex] = cell.id.split("-").map(Number);
        updatedGrid[rowIndex][colIndex] = {...updatedGrid[rowIndex][colIndex], isFood: foodType === "smallFood", isBigFood: foodType === "bigFood"};
        setGridFunc(updatedGrid);
    }
}