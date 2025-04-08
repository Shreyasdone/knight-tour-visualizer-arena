
export type Position = {
  row: number;
  col: number;
};

export type Step = Position & {
  stepNumber: number;
};

export type AlgorithmResult = {
  name: string;
  path: Step[];
  executionTime: number;
  success: boolean;
  color: string;
};

export type BoardSize = 5 | 6 | 8 | number;

export enum AnimationSpeed {
  Slow = 1000,
  Medium = 500,
  Fast = 200
}

export enum AlgorithmType {
  BruteForce = 'BruteForce',
  DivideAndConquer = 'DivideAndConquer',
  SimulatedAnnealing = 'SimulatedAnnealing',
  Warnsdorff = 'Warnsdorff',
  DFS = 'DFS'
}

export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'finished';
