
import React, { useState } from 'react';
import { Position } from '../utils/types';
import { getCellColor, isSamePosition, positionToKey } from '../utils/helpers';
import Knight from './Knight';

interface ChessboardProps {
  size: number;
  startPosition: Position | null;
  onCellClick: (position: Position) => void;
  currentPosition?: Position | null;
  visitedPositions?: Position[];
  pathPositions?: Position[];
  highlightedPositions?: Position[];
  disabled?: boolean;
  algorithmColor?: string;
}

const Chessboard: React.FC<ChessboardProps> = ({
  size,
  startPosition,
  onCellClick,
  currentPosition = null,
  visitedPositions = [],
  pathPositions = [],
  highlightedPositions = [],
  disabled = false,
  algorithmColor = '#E57373'
}) => {
  // Calculate cell size based on responsive design
  const calculateCellSize = () => {
    // Base size for small boards, adjust for larger boards
    const baseSize = Math.min(40, 400 / size);
    return baseSize;
  };
  
  const cellSize = calculateCellSize();
  
  // Create position maps for O(1) lookups
  const visitedSet = new Set<string>(
    visitedPositions.map(pos => positionToKey(pos))
  );
  
  const pathSet = new Set<string>(
    pathPositions.map(pos => positionToKey(pos))
  );
  
  const highlightSet = new Set<string>(
    highlightedPositions.map(pos => positionToKey(pos))
  );
  
  // Map positions to their step number for rendering path order
  const positionToStepMap = new Map<string, number>();
  pathPositions.forEach((pos, index) => {
    positionToStepMap.set(positionToKey(pos), index + 1);
  });

  const handleCellClick = (position: Position) => {
    if (!disabled) {
      onCellClick(position);
    }
  };

  const getCellStyle = (position: Position): string => {
    const baseColor = getCellColor(position.row, position.col);
    const isStart = startPosition && isSamePosition(position, startPosition);
    const isCurrent = currentPosition && isSamePosition(position, currentPosition);
    
    const posKey = positionToKey(position);
    const isVisited = visitedSet.has(posKey);
    const isPath = pathSet.has(posKey);
    const isHighlighted = highlightSet.has(posKey);
    
    let classes = `${baseColor === 'chessLight' ? 'bg-chessLight' : 'bg-chessDark'} `;
    
    if (isStart) {
      classes += 'ring-2 ring-blue-500 ';
    }
    
    if (isCurrent) {
      classes += `bg-chessCurrent ${isVisited ? 'bg-opacity-90' : ''} `;
    } else if (isPath) {
      classes += `bg-opacity-80 `;
    } else if (isVisited) {
      classes += `bg-chessVisited bg-opacity-70 `;
    } else if (isHighlighted) {
      classes += `bg-chessMoveHint bg-opacity-60 `;
    }
    
    return classes;
  };

  return (
    <div 
      className="border border-gray-400 shadow-lg"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
        width: `${cellSize * size}px`,
        height: `${cellSize * size}px`
      }}
    >
      {Array.from({ length: size * size }).map((_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const position: Position = { row, col };
        const isStart = startPosition && isSamePosition(position, startPosition);
        const isCurrent = currentPosition && isSamePosition(position, currentPosition);
        const posKey = positionToKey(position);
        const stepNumber = positionToStepMap.get(posKey);
        
        return (
          <div
            key={index}
            className={`relative ${getCellStyle(position)} flex items-center justify-center cursor-pointer transition-all duration-150 hover:opacity-90`}
            style={{ 
              width: `${cellSize}px`, 
              height: `${cellSize}px` 
            }}
            onClick={() => handleCellClick(position)}
          >
            {/* Step number for all visited cells */}
            {stepNumber && (
              <div 
                className="absolute inset-0 flex items-center justify-center font-bold z-10"
                style={{ 
                  color: algorithmColor,
                  fontSize: `${Math.max(10, cellSize * 0.4)}px` 
                }}
              >
                {stepNumber}
              </div>
            )}
            
            {/* Knight position */}
            {(isStart || isCurrent) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Knight color={algorithmColor} size={cellSize * 0.7} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Chessboard;
