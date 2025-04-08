
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
      // Generate a neighboring tour by swapping two random steps
      const neighbor = getNeighbor(currentTour);
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
  
  // Fix step numbers after possible swaps
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

// Generate a neighboring tour by swapping two random steps
const getNeighbor = (tour: Step[]): Step[] => {
  const neighbor = clonePath(tour);
  
  // Don't swap the first position
  const idx1 = 1 + Math.floor(Math.random() * (neighbor.length - 1));
  let idx2 = 1 + Math.floor(Math.random() * (neighbor.length - 1));
  
  // Ensure two different indices
  while (idx1 === idx2) {
    idx2 = 1 + Math.floor(Math.random() * (neighbor.length - 1));
  }
  
  // Swap positions
  const temp = { ...neighbor[idx1] };
  neighbor[idx1] = { ...neighbor[idx2], stepNumber: idx1 + 1 };
  neighbor[idx2] = { ...temp, stepNumber: idx2 + 1 };
  
  return neighbor;
};

// Evaluate the quality of a tour (higher is better)
const evaluateTour = (tour: Step[], boardSize: number): number => {
  let score = tour.length; // Base score is the number of steps
  
  // Check for valid knight moves between steps
  for (let i = 1; i < tour.length; i++) {
    const { row: r1, col: c1 } = tour[i - 1];
    const { row: r2, col: c2 } = tour[i];
    
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);
    
    // If this is a valid knight move, increase score
    if ((rowDiff === 1 && colDiff === 2) || (rowDiff === 2 && colDiff === 1)) {
      score += 1;
    } else {
      score -= 5; // Penalty for invalid moves
    }
  }
  
  // Bonus for complete tours
  if (tour.length === boardSize * boardSize) {
    score += 100;
  }
  
  return score;
};

// Validate a tour
const validateTour = (tour: Step[], boardSize: number): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check length
  if (tour.length !== boardSize * boardSize) {
    issues.push(`Tour has ${tour.length} steps, expected ${boardSize * boardSize}`);
  }
  
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
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

export default solveSimulatedAnnealing;
