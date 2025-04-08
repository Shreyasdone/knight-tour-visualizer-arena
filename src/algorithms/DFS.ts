
import { Position, Step, AlgorithmResult } from '../utils/types';
import { getKnightMoves, positionToKey, calculateDegree } from '../utils/helpers';

export const solveDFS = (
  startPosition: Position,
  boardSize: number
): AlgorithmResult => {
  const startTime = performance.now();
  
  // Initialize variables
  const path: Step[] = [{ ...startPosition, stepNumber: 1 }];
  const visited = new Set<string>([positionToKey(startPosition)]);
  const totalCells = boardSize * boardSize;
  
  // Try to find a complete tour using DFS with Warnsdorff's heuristic
  const success = findTourDFS(startPosition, path, visited, boardSize, totalCells);
  
  const endTime = performance.now();
  
  return {
    name: 'Warnsdorff DFS',
    path: path,
    executionTime: endTime - startTime,
    success: success,
    color: '#9575CD'
  };
};

const findTourDFS = (
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
  
  // Sort moves according to Warnsdorff's heuristic (fewest onward moves first)
  const sortedMoves = possibleMoves
    .filter(move => !visited.has(positionToKey(move)))
    .sort((a, b) => 
      calculateDegree(a, boardSize, visited) - 
      calculateDegree(b, boardSize, visited)
    );
  
  // Try each possible move in the sorted order
  for (const move of sortedMoves) {
    const moveKey = positionToKey(move);
    
    // Add to path and mark as visited
    path.push({ ...move, stepNumber: path.length + 1 });
    visited.add(moveKey);
    
    // Recursively try to find solution from this new position
    if (findTourDFS(move, path, visited, boardSize, totalCells)) {
      return true;
    }
    
    // Backtrack if no solution found
    path.pop();
    visited.delete(moveKey);
  }
  
  return false;
};

export default solveDFS;
