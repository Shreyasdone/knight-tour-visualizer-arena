
import { Position, AlgorithmResult, Step } from '../utils/types';
import { positionToKey, getKnightMoves } from '../utils/helpers';

// Priority Queue implementation for A* algorithm
class PriorityQueue {
  queue: { item: any; priority: number }[];

  constructor() {
    this.queue = [];
  }

  enqueue(item: any, priority: number) {
    this.queue.push({ item, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.queue.shift()!.item;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

// A* algorithm for Knight's Tour
const solveAStar = (startPosition: Position, boardSize: number): AlgorithmResult => {
  console.log(`Starting A* algorithm for board size ${boardSize} from position [${startPosition.row}, ${startPosition.col}]`);
  const startTime = performance.now();

  // Initialize result path with the starting position
  const path: Step[] = [
    { ...startPosition, stepNumber: 1 }
  ];

  // Total number of cells to visit for complete tour
  const totalCells = boardSize * boardSize;
  
  // Initialize visited set with the starting position
  const visited = new Set<string>([positionToKey(startPosition)]);
  
  // Initialize priority queue
  const pq = new PriorityQueue();
  
  // Enqueue starting state
  pq.enqueue({
    path,
    visited,
    lastPosition: startPosition
  }, 0);
  
  // Simple heuristic: count onward moves (Warnsdorff-like)
  const heuristic = (position: Position, visited: Set<string>): number => {
    const moves = getKnightMoves(position, boardSize);
    let accessibleMoves = 0;
    
    for (const move of moves) {
      if (!visited.has(positionToKey(move))) {
        accessibleMoves++;
      }
    }
    
    // Lower score is better: fewer accessible moves = higher priority
    // This implements Warnsdorff's rule as a heuristic
    return accessibleMoves;
  };
  
  let bestPath: Step[] = [...path];
  
  // A* search main loop
  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    
    if (!current) break;
    
    const { path: currentPath, visited: currentVisited, lastPosition } = current;
    
    // If current path is longer than our best path so far, update the best path
    if (currentPath.length > bestPath.length) {
      bestPath = [...currentPath];
    }
    
    // If we've visited all cells, we've found a complete tour
    if (currentPath.length === totalCells) {
      console.log("Complete tour found!");
      const endTime = performance.now();
      return {
        name: 'A* Search',
        path: currentPath,
        executionTime: endTime - startTime,
        success: true,
        color: '#6D28D9' // Purple color for A*
      };
    }
    
    // Get valid knight moves from the last position
    const moves = getKnightMoves(lastPosition, boardSize);
    
    // Try each possible move
    for (const move of moves) {
      const moveKey = positionToKey(move);
      
      // Skip already visited positions
      if (currentVisited.has(moveKey)) continue;
      
      // Create new path and visited set for this move
      const newPath = [
        ...currentPath,
        { ...move, stepNumber: currentPath.length + 1 }
      ];
      
      const newVisited = new Set<string>(currentVisited);
      newVisited.add(moveKey);
      
      // Calculate priority using heuristic
      const priority = heuristic(move, newVisited);
      
      // Enqueue the new state
      pq.enqueue({
        path: newPath,
        visited: newVisited,
        lastPosition: move
      }, priority);
    }
  }
  
  console.log(`A* search completed with best path length: ${bestPath.length} of ${totalCells}`);
  const endTime = performance.now();
  
  // Return the best path found (might be incomplete)
  return {
    name: 'A* Search',
    path: bestPath,
    executionTime: endTime - startTime,
    success: bestPath.length === totalCells,
    color: '#6D28D9' // Purple color for A*
  };
};

export default solveAStar;
