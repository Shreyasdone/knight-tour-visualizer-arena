
import { Position, Step } from './types';

// Check if a position is valid on the board
export const isValidPosition = (position: Position, boardSize: number): boolean => {
  const { row, col } = position;
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
};

// Get all possible knight moves from a position
export const getKnightMoves = (position: Position, boardSize: number): Position[] => {
  const { row, col } = position;
  const moves: Position[] = [
    { row: row - 2, col: col - 1 },
    { row: row - 2, col: col + 1 },
    { row: row - 1, col: col - 2 },
    { row: row - 1, col: col + 2 },
    { row: row + 1, col: col - 2 },
    { row: row + 1, col: col + 2 },
    { row: row + 2, col: col - 1 },
    { row: row + 2, col: col + 1 },
  ];

  return moves.filter(move => isValidPosition(move, boardSize));
};

// Format execution time for display
export const formatExecutionTime = (timeMs: number): string => {
  if (timeMs < 1) {
    return '< 1 ms';
  } else if (timeMs < 1000) {
    return `${Math.round(timeMs)} ms`;
  } else {
    return `${(timeMs / 1000).toFixed(2)} s`;
  }
};

// Get the cell color based on row and column
export const getCellColor = (row: number, col: number): string => {
  return (row + col) % 2 === 0 ? 'chessLight' : 'chessDark';
};

// Check if two positions are the same
export const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

// Convert position to a unique string key
export const positionToKey = (position: Position): string => {
  return `${position.row}-${position.col}`;
};

// Calculate the degree of a position (number of possible next moves)
export const calculateDegree = (position: Position, boardSize: number, visited: Set<string>): number => {
  const possibleMoves = getKnightMoves(position, boardSize);
  return possibleMoves.filter(move => !visited.has(positionToKey(move))).length;
};

// Clone a path array (deep copy)
export const clonePath = (path: Step[]): Step[] => {
  return path.map(step => ({ ...step }));
};
