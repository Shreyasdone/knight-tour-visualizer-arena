
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
  const maxBoardWidth = 400; // Maximum board width in pixels
  const cellSize = Math.floor(maxBoardWidth / size);
  
  // Create visited positions map for O(1) lookups
  const visitedSet = new Set<string>(
    visitedPositions.map(pos => positionToKey(pos))
  );
  
  // Create path positions map for O(1) lookups
  const pathSet = new Set<string>(
    pathPositions.map(pos => positionToKey(pos))
  );
  
  // Create highlighted positions map for O(1) lookups
  const highlightSet = new Set<string>(
    highlightedPositions.map(pos => positionToKey(pos))
  );

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
    
    let classes = `bg-${baseColor} `;
    
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
      className={`grid grid-cols-${size} border border-gray-400 shadow-lg`}
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-gray-500 opacity-60">
                {row},{col}
              </div>
            </div>
            
            {(isStart || isCurrent) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Knight color={algorithmColor} size={cellSize * 0.7} />
              </div>
            )}
            
            {pathPositions?.some(pos => isSamePosition(pos, position)) && (
              <div 
                className="absolute left-1/2 bottom-1/2 h-2 w-2 rounded-full bg-opacity-70 transform -translate-x-1/2 translate-y-1/2"
                style={{ backgroundColor: algorithmColor }}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Chessboard;
