
import { Position, Step, AlgorithmResult } from '../utils/types';
import { positionToKey } from '../utils/helpers';

export const solveDivideAndConquer = (
  startPosition: Position,
  boardSize: number
): AlgorithmResult => {
  const startTime = performance.now();
  
  // Only works for board sizes that are powers of 2
  if (boardSize < 4 || (boardSize & (boardSize - 1)) !== 0) {
    return {
      name: 'Divide and Conquer',
      path: [{ ...startPosition, stepNumber: 1 }],
      executionTime: performance.now() - startTime,
      success: false,
      color: '#64B5F6'
    };
  }
  
  // Initialize the chessboard with -1 (unvisited)
  const board: number[][] = Array(boardSize)
    .fill(0)
    .map(() => Array(boardSize).fill(-1));
  
  // Mark starting position
  board[startPosition.row][startPosition.col] = 0;
  
  // Solve the tour
  solveKnightTour(board, startPosition.row, startPosition.col, 0, boardSize);
  
  // Build the path from the board
  const path: Step[] = [];
  for (let step = 0; step < boardSize * boardSize; step++) {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (board[row][col] === step) {
          path.push({ row, col, stepNumber: step + 1 });
          break;
        }
      }
    }
  }
  
  const endTime = performance.now();
  
  return {
    name: 'Divide and Conquer',
    path: path,
    executionTime: endTime - startTime,
    success: path.length === boardSize * boardSize,
    color: '#64B5F6'
  };
};

// Solve the Knight's Tour using the Divide and Conquer technique
const solveKnightTour = (
  board: number[][],
  row: number,
  col: number,
  moveCount: number,
  boardSize: number
): boolean => {
  // Base case: all squares visited
  if (moveCount === boardSize * boardSize - 1) {
    return true;
  }
  
  // Define knight's possible moves
  const moveX = [2, 1, -1, -2, -2, -1, 1, 2];
  const moveY = [1, 2, 2, 1, -1, -2, -2, -1];
  
  // Try all next moves
  for (let i = 0; i < 8; i++) {
    const nextRow = row + moveX[i];
    const nextCol = col + moveY[i];
    
    // Check if the move is valid
    if (
      nextRow >= 0 && nextRow < boardSize && 
      nextCol >= 0 && nextCol < boardSize && 
      board[nextRow][nextCol] === -1
    ) {
      board[nextRow][nextCol] = moveCount + 1;
      
      if (solveKnightTour(board, nextRow, nextCol, moveCount + 1, boardSize)) {
        return true;
      } else {
        // Backtrack
        board[nextRow][nextCol] = -1;
      }
    }
  }
  
  return false;
};

export default solveDivideAndConquer;
