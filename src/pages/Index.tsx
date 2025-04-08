
import React, { useState, useEffect, useCallback } from 'react';
import Chessboard from '@/components/Chessboard';
import ControlPanel from '@/components/ControlPanel';
import AlgorithmPanel from '@/components/AlgorithmPanel';
import ComparisonChart from '@/components/ComparisonChart';
import Knight from '@/components/Knight';
import { 
  Position, 
  Step, 
  AlgorithmResult, 
  BoardSize, 
  AnimationSpeed,
  PlaybackState,
  AlgorithmType
} from '@/utils/types';
import solveBruteForce from '@/algorithms/BruteForce';
import solveDivideAndConquer from '@/algorithms/DivideAndConquer';
import solveSimulatedAnnealing from '@/algorithms/SimulatedAnnealing';
import solveWarnsdorff from '@/algorithms/Warnsdorff';
import solveDFS from '@/algorithms/DFS';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();
  
  // State for board configuration
  const [boardSize, setBoardSize] = useState<BoardSize>(5);
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  
  // State for algorithm results
  const [results, setResults] = useState<AlgorithmResult[]>([]);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  
  // State for animation and playback
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>(AnimationSpeed.Medium);
  const [instantMode, setInstantMode] = useState<boolean>(false);
  
  // UI state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Initialize the board with a default starting position
  useEffect(() => {
    // Default center position
    const centerRow = Math.floor(boardSize / 2);
    const centerCol = Math.floor(boardSize / 2);
    setStartPosition({ row: centerRow, col: centerCol });
    
    // Reset all state when board size changes
    setResults([]);
    setCurrentStep(0);
    setPlaybackState('stopped');
  }, [boardSize]);

  // Handle cell click to set starting position
  const handleCellClick = (position: Position) => {
    if (isComputing) return;
    
    setStartPosition(position);
    setResults([]);
    setCurrentStep(0);
    setPlaybackState('stopped');
    
    toast({
      title: "Start Position Set",
      description: `Knight will start at position (${position.row}, ${position.col})`,
    });
  };
  
  // Run all algorithms
  const runAlgorithms = useCallback(async () => {
    if (!startPosition) {
      toast({
        title: "Error",
        description: "Please select a starting position for the knight",
        variant: "destructive"
      });
      return;
    }
    
    setIsComputing(true);
    setResults([]);
    setCurrentStep(0);
    setPlaybackState('stopped');
    
    toast({
      title: "Computing",
      description: "Running all knight's tour algorithms...",
    });
    
    // Run algorithms in parallel using web workers or setTimeout for non-blocking UI
    setTimeout(async () => {
      try {
        const bruteForceResult = solveBruteForce(startPosition, boardSize);
        const divideAndConquerResult = solveDivideAndConquer(startPosition, boardSize);
        const simulatedAnnealingResult = solveSimulatedAnnealing(startPosition, boardSize);
        const warnsdorffResult = solveWarnsdorff(startPosition, boardSize);
        const dfsResult = solveDFS(startPosition, boardSize);
        
        // Collect all results
        const allResults = [
          bruteForceResult,
          divideAndConquerResult,
          simulatedAnnealingResult,
          warnsdorffResult,
          dfsResult
        ];
        
        setResults(allResults);
        setPlaybackState('stopped');
        setCurrentStep(0);
        
        toast({
          title: "Algorithms Completed",
          description: "All knight's tour algorithms have finished execution",
        });
        
      } catch (error) {
        console.error('Error computing knight tours:', error);
        toast({
          title: "Computation Error",
          description: "An error occurred during algorithm execution",
          variant: "destructive"
        });
      } finally {
        setIsComputing(false);
      }
    }, 100);
  }, [startPosition, boardSize, toast]);
  
  // Handle animation step updates
  useEffect(() => {
    let animationTimer: NodeJS.Timeout | null = null;
    
    if (playbackState === 'playing' && results.length > 0) {
      const maxPathLength = Math.max(...results.map(r => r.path.length));
      
      if (currentStep >= maxPathLength - 1) {
        setPlaybackState('finished');
        return;
      }
      
      animationTimer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, animationSpeed);
    }
    
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [playbackState, currentStep, results, animationSpeed]);
  
  // Calculate maximum steps across all algorithms
  const maxSteps = results.length > 0 
    ? Math.max(...results.map(result => result.path.length)) 
    : 0;
  
  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };
  
  useEffect(() => {
    // Run algorithms automatically when starting position is set and instant mode is enabled
    if (startPosition && instantMode && !isComputing && results.length === 0) {
      runAlgorithms();
    }
  }, [startPosition, instantMode, isComputing, results, runAlgorithms]);
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pb-12 ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto max-w-7xl px-4">
        <header className="py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Knight's Tour Algorithm Visualizer</h1>
          <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">Compare different algorithms for solving the Knight's Tour problem</p>
        </header>
        
        <main className="space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Select Starting Position</h2>
                <div className="flex justify-center">
                  <Chessboard 
                    size={boardSize}
                    startPosition={startPosition}
                    onCellClick={handleCellClick}
                    disabled={isComputing}
                  />
                </div>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                  Click a square to set the knight's starting position
                </p>
              </div>
              
              <ControlPanel 
                boardSize={boardSize}
                onBoardSizeChange={setBoardSize}
                playbackState={playbackState}
                onPlay={() => setPlaybackState('playing')}
                onPause={() => setPlaybackState('paused')}
                onReset={() => {
                  setCurrentStep(0);
                  setPlaybackState('stopped');
                }}
                onStepForward={() => {
                  if (currentStep < maxSteps - 1) {
                    setCurrentStep(prevStep => prevStep + 1);
                  } else {
                    setPlaybackState('finished');
                  }
                }}
                onStepBack={() => {
                  if (currentStep > 0) {
                    setCurrentStep(prevStep => prevStep - 1);
                  }
                }}
                animationSpeed={animationSpeed}
                onAnimationSpeedChange={setAnimationSpeed}
                instantMode={instantMode}
                onToggleInstantMode={() => setInstantMode(prev => !prev)}
                isDarkMode={isDarkMode}
                onToggleDarkMode={handleToggleDarkMode}
                isComputing={isComputing}
              />
              
              {startPosition && !isComputing && results.length === 0 && (
                <div className="text-center">
                  <button 
                    onClick={runAlgorithms}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition-colors"
                    disabled={isComputing || !startPosition}
                  >
                    {isComputing ? 'Computing...' : 'Run All Algorithms'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Algorithm Comparison</h2>
                
                {results.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-full">
                        <AlgorithmPanel
                          name="Brute Force"
                          boardSize={boardSize}
                          startPosition={startPosition!}
                          result={results.find(r => r.name === 'Brute Force') || null}
                          isLoading={isComputing}
                          currentStep={currentStep}
                          playbackState={playbackState}
                        />
                      </div>
                      
                      <div className="h-full">
                        <AlgorithmPanel
                          name="Divide and Conquer"
                          boardSize={boardSize}
                          startPosition={startPosition!}
                          result={results.find(r => r.name === 'Divide and Conquer') || null}
                          isLoading={isComputing}
                          currentStep={currentStep}
                          playbackState={playbackState}
                        />
                      </div>
                      
                      <div className="h-full">
                        <AlgorithmPanel
                          name="Simulated Annealing"
                          boardSize={boardSize}
                          startPosition={startPosition!}
                          result={results.find(r => r.name === 'Simulated Annealing') || null}
                          isLoading={isComputing}
                          currentStep={currentStep}
                          playbackState={playbackState}
                        />
                      </div>
                      
                      <div className="h-full">
                        <AlgorithmPanel
                          name="Warnsdorff"
                          boardSize={boardSize}
                          startPosition={startPosition!}
                          result={results.find(r => r.name === 'Warnsdorff') || null}
                          isLoading={isComputing}
                          currentStep={currentStep}
                          playbackState={playbackState}
                        />
                      </div>
                      
                      <div className="h-full md:col-span-2 lg:col-span-1">
                        <AlgorithmPanel
                          name="Warnsdorff DFS"
                          boardSize={boardSize}
                          startPosition={startPosition!}
                          result={results.find(r => r.name === 'Warnsdorff DFS') || null}
                          isLoading={isComputing}
                          currentStep={currentStep}
                          playbackState={playbackState}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Performance Metrics</h2>
                      <ComparisonChart results={results} />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    {isComputing ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <Knight size={60} />
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Computing knight's tour algorithms...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          Click the "Run All Algorithms" button to start the visualization
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
        
        <footer className="pt-12 pb-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Knight's Tour Algorithm Visualizer &copy; 2025</p>
          <p className="mt-2">A visual comparison of different algorithms for solving the Knight's Tour problem</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
