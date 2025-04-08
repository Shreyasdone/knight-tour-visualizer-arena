import { Position, Step, AlgorithmResult } from '../utils/types';
import { getKnightMoves, positionToKey, calculateDegree } from '../utils/helpers';

export const solveWarnsdorff = (
  startPosition: Position,
  boardSize: number
): AlgorithmResult => {
  const startTime = performance.now();
  
  // Initialize variables
  const path: Step[] = [{ ...startPosition, stepNumber: 1 }];
  const visited = new Set<string>([positionToKey(startPosition)]);
  let currentPos = { ...startPosition };
  const totalCells = boardSize * boardSize;
  
  // Keep making moves until we can't or we've visited all cells
  while (visited.size < totalCells) {
    // Get all possible moves from current position
    const possibleMoves = getKnightMoves(currentPos, boardSize);
    
    // Filter out visited moves and sort by degree (number of next moves)
    const nextMoves = possibleMoves
      .filter(move => !visited.has(positionToKey(move)))
      .sort((a, b) => 
        calculateDegree(a, boardSize, visited) - 
        calculateDegree(b, boardSize, visited)
      );
    
    // If no more moves possible, break
    if (nextMoves.length === 0) {
      break;
    }
    
    // Choose move with the minimum degree (Warnsdorff's heuristic)
    currentPos = nextMoves[0];
    
    // Add to path and mark as visited
    path.push({ ...currentPos, stepNumber: path.length + 1 });
    visited.add(positionToKey(currentPos));
  }
  
  const endTime = performance.now();
  
  return {
    name: 'Warnsdorff',
    path: path,
    executionTime: endTime - startTime,
    success: visited.size === totalCells,
    color: '#FFB74D'
  };
};

export default solveWarnsdorff;
