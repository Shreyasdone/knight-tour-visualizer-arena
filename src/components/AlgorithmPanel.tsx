
import React, { useState, useEffect } from 'react';
import { Position, Step, AlgorithmResult, PlaybackState } from '../utils/types';
import Chessboard from './Chessboard';
import Loader from './Loader';
import { formatExecutionTime } from '../utils/helpers';

interface AlgorithmPanelProps {
  name: string;
  boardSize: number;
  startPosition: Position;
  result: AlgorithmResult | null;
  isLoading: boolean;
  currentStep: number;
  playbackState: PlaybackState;
}

const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  name,
  boardSize,
  startPosition,
  result,
  isLoading,
  currentStep,
  playbackState
}) => {
  // Determine current position and visited based on current step
  const getCurrentPosition = (): Position | null => {
    if (!result || result.path.length === 0) return null;
    if (currentStep >= result.path.length) return result.path[result.path.length - 1];
    return result.path[currentStep];
  };
  
  const getVisitedPositions = (): Position[] => {
    if (!result || result.path.length === 0) return [];
    return result.path.slice(0, currentStep + 1);
  };
  
  const getPathPositions = (): Position[] => {
    if (!result || result.path.length === 0) return [];
    return result.path.slice(0, currentStep);
  };

  // Calculate the current status text and color
  const getStatusInfo = () => {
    if (isLoading) {
      return { text: 'Computing...', color: 'text-blue-500' };
    }
    
    if (!result) {
      return { text: 'Ready', color: 'text-gray-500' };
    }
    
    if (playbackState === 'playing') {
      return { text: 'Playing', color: 'text-green-500' };
    }
    
    if (playbackState === 'paused') {
      return { text: 'Paused', color: 'text-yellow-500' };
    }
    
    if (playbackState === 'stopped') {
      return { text: 'Stopped', color: 'text-gray-500' };
    }
    
    if (playbackState === 'finished') {
      return { 
        text: result.success ? 'Complete Tour' : 'Incomplete Tour', 
        color: result.success ? 'text-green-500' : 'text-red-500' 
      };
    }
    
    return { text: 'Unknown', color: 'text-gray-500' };
  };
  
  const { text: statusText, color: statusColor } = getStatusInfo();

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2" style={{ color: result?.color || 'inherit' }}>
        {name}
      </h3>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <Loader message={`Computing ${name}...`} />
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <Chessboard
                size={boardSize}
                startPosition={startPosition}
                onCellClick={() => {}} // No effect in algorithm panels
                currentPosition={getCurrentPosition()}
                visitedPositions={getVisitedPositions()}
                pathPositions={getPathPositions()}
                disabled={true}
                algorithmColor={result?.color}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Status:</div>
              <div className={`font-bold ${statusColor}`}>{statusText}</div>
              
              <div className="font-medium">Step:</div>
              <div>
                {currentStep + 1} / {result?.path.length || 0}
              </div>
              
              {result && (
                <>
                  <div className="font-medium">Time:</div>
                  <div>{formatExecutionTime(result.executionTime)}</div>
                  
                  <div className="font-medium">Tour:</div>
                  <div className={result.success ? 'text-green-500' : 'text-red-500'}>
                    {result.success ? 'Complete' : 'Incomplete'}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlgorithmPanel;
