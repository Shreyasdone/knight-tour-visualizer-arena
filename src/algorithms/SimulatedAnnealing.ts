
import { Position, Step, AlgorithmResult } from '../utils/types';
import { positionToKey, getKnightMoves, clonePath } from '../utils/helpers';

export const solveSimulatedAnnealing = (
  startPosition: Position,
  boardSize: number
): AlgorithmResult => {
  const startTime = performance.now();
  
  // Parameters for simulated annealing
  const initialTemperature = 10.0;
  const coolingRate = 0.99;
  const minTemperature = 0.001;
  const stepsPerTemp = 100;
  
  // Get initial tour using a greedy approach
  const initialTour = getInitialTour(startPosition, boardSize);
  let bestTour = clonePath(initialTour);
  let bestScore = evaluateTour(bestTour, boardSize);
  
  let currentTour = clonePath(initialTour);
  let currentScore = bestScore;
  
  let temperature = initialTemperature;
  
  // Main simulated annealing loop
  while (temperature > minTemperature) {
    for (let i = 0; i < stepsPerTemp; i++) {
      // Generate improved neighbor using pivot-based approach
      const neighbor = getPivotBasedNeighbor(currentTour, boardSize);
      const neighborScore = evaluateTour(neighbor, boardSize);
      
      // Calculate acceptance probability
      const delta = neighborScore - currentScore;
      const acceptanceProbability = delta > 0 ? 1.0 : Math.exp(delta / temperature);
      
      // Accept neighbor with probability
      if (Math.random() < acceptanceProbability) {
        currentTour = neighbor;
        currentScore = neighborScore;
        
        // Update best tour if improved
        if (currentScore > bestScore) {
          bestTour = clonePath(currentTour);
          bestScore = currentScore;
        }
      }
    }
    
    // Cool down
    temperature *= coolingRate;
  }
  
  // Fix step numbers
  const fixedTour = bestTour.map((step, index) => ({
    ...step,
    stepNumber: index + 1
  }));
  
  const endTime = performance.now();
  
  // Check if it's a valid tour
  const validity = validateTour(fixedTour, boardSize);
  
  return {
    name: 'Simulated Annealing',
    path: fixedTour,
    executionTime: endTime - startTime,
    success: validity.isValid,
    color: '#81C784'
  };
};

// Generate an initial tour using a greedy approach
const getInitialTour = (startPosition: Position, boardSize: number): Step[] => {
  const tour: Step[] = [{ ...startPosition, stepNumber: 1 }];
  const visited = new Set<string>([positionToKey(startPosition)]);
  let currentPos = { ...startPosition };
  
  while (tour.length < boardSize * boardSize) {
    const moves = getKnightMoves(currentPos, boardSize).filter(
      move => !visited.has(positionToKey(move))
    );
    
    if (moves.length === 0) break;
    
    // Choose a random unvisited move
    const nextMove = moves[Math.floor(Math.random() * moves.length)];
    tour.push({ ...nextMove, stepNumber: tour.length + 1 });
    visited.add(positionToKey(nextMove));
    currentPos = nextMove;
  }
  
  return tour;
};

// Generate a neighbor using pivot-based approach
const getPivotBasedNeighbor = (tour: Step[], boardSize: number): Step[] => {
  // Choose a random pivot point in the tour (not the first position)
  const pivotIdx = 1 + Math.floor(Math.random() * (tour.length - 1));
  
  // Create a new tour with the same prefix up to the pivot
  const neighbor = clonePath(tour.slice(0, pivotIdx));
  
  // Create set of visited positions for O(1) lookups
  const visited = new Set<string>(
    neighbor.map(pos => positionToKey(pos))
  );
  
  // Current position is the last one in the prefix
  let currentPos = { ...neighbor[neighbor.length - 1] };
  
  // Extend the tour from the pivot
  while (neighbor.length < boardSize * boardSize) {
    // Get valid knight moves from current position
    const moves = getKnightMoves(currentPos, boardSize).filter(
      move => !visited.has(positionToKey(move))
    );
    
    // If no valid moves remain, break the loop
    if (moves.length === 0) break;
    
    // Choose a random unvisited move
    const nextMove = moves[Math.floor(Math.random() * moves.length)];
    
    // Fix: Add the stepNumber property when creating the Step object
    neighbor.push({ 
      row: nextMove.row, 
      col: nextMove.col, 
      stepNumber: neighbor.length + 1 
    });
    
    visited.add(positionToKey(nextMove));
    currentPos = { row: nextMove.row, col: nextMove.col, stepNumber: neighbor.length }; // Fix: Update currentPos to include stepNumber
  }
  
  return neighbor;
};

// Simplified evaluation of tour quality (higher is better)
// This approach aims to directly reward longer valid paths
const evaluateTour = (tour: Step[], boardSize: number): number => {
  const totalCells = boardSize * boardSize;
  const cost = totalCells - tour.length; // Lower cost for longer tours
  
  // Validate that all steps are valid knight moves
  for (let i = 1; i < tour.length; i++) {
    const { row: r1, col: c1 } = tour[i - 1];
    const { row: r2, col: c2 } = tour[i];
    
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);
    
    // If this is not a valid knight move, heavily penalize
    if (!((rowDiff === 1 && colDiff === 2) || (rowDiff === 2 && colDiff === 1))) {
      return totalCells * 2; // Worst possible score (higher cost)
    }
  }
  
  // For valid tours, return negative cost (smaller is better for cost, but we return negative because our algorithm maximizes)
  return -cost;
};

// Validate a tour
const validateTour = (tour: Step[], boardSize: number): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for valid knight moves between consecutive positions
  for (let i = 1; i < tour.length; i++) {
    const { row: r1, col: c1 } = tour[i - 1];
    const { row: r2, col: c2 } = tour[i];
    
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);
    
    if (!((rowDiff === 1 && colDiff === 2) || (rowDiff === 2 && colDiff === 1))) {
      issues.push(`Invalid knight move from (${r1},${c1}) to (${r2},${c2})`);
    }
  }
  
  // Check for duplicates
  const visited = new Set<string>();
  for (const step of tour) {
    const key = positionToKey(step);
    if (visited.has(key)) {
      issues.push(`Position (${step.row},${step.col}) visited multiple times`);
    }
    visited.add(key);
  }
  
  // Check if it's a complete tour
  const isComplete = tour.length === boardSize * boardSize;
  if (!isComplete) {
    issues.push(`Tour has ${tour.length} steps, expected ${boardSize * boardSize}`);
  }
  
  return {
    isValid: issues.length === 0 && isComplete, // Valid only if complete and no issues
    issues
  };
};

export default solveSimulatedAnnealing;
