
import { Position, Step, AlgorithmResult } from '../utils/types';
import { getKnightMoves, positionToKey } from '../utils/helpers';

export const solveBruteForce = (
  startPosition: Position,
  boardSize: number
): AlgorithmResult => {
  const startTime = performance.now();
  
  // Initialize variables
  const path: Step[] = [{ ...startPosition, stepNumber: 1 }];
  const visited = new Set<string>([positionToKey(startPosition)]);
  const totalCells = boardSize * boardSize;
  
  // Try to find a complete tour
  const success = findTour(startPosition, path, visited, boardSize, totalCells);
  
  const endTime = performance.now();
  
  return {
    name: 'Brute Force',
    path: path,
    executionTime: endTime - startTime,
    success: success,
    color: '#E57373'
  };
};

const findTour = (
  currentPos: Position,
  path: Step[],
  visited: Set<string>,
  boardSize: number,
  totalCells: number
): boolean => {
  // Base case: we've visited all cells
  if (visited.size === totalCells) {
    return true;
  }
  
  // Get all possible moves from current position
  const possibleMoves = getKnightMoves(currentPos, boardSize);
  
  // Try each possible move
  for (const move of possibleMoves) {
    const moveKey = positionToKey(move);
    
    // Skip if already visited
    if (visited.has(moveKey)) {
      continue;
    }
    
    // Add to path and mark as visited
    path.push({ ...move, stepNumber: path.length + 1 });
    visited.add(moveKey);
    
    // Recursively try to find solution from this new position
    if (findTour(move, path, visited, boardSize, totalCells)) {
      return true;
    }
    
    // Backtrack if no solution found
    path.pop();
    visited.delete(moveKey);
  }
  
  return false;
};

export default solveBruteForce;
