
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  SkipBack, 
  SkipForward,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { AnimationSpeed, PlaybackState, BoardSize } from '../utils/types';

interface ControlPanelProps {
  boardSize: BoardSize;
  onBoardSizeChange: (size: number) => void;
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  animationSpeed: AnimationSpeed;
  onAnimationSpeedChange: (speed: AnimationSpeed) => void;
  instantMode: boolean;
  onToggleInstantMode: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isComputing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  boardSize,
  onBoardSizeChange,
  playbackState,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  animationSpeed,
  onAnimationSpeedChange,
  instantMode,
  onToggleInstantMode,
  isDarkMode,
  onToggleDarkMode,
  isComputing
}) => {
  // Determine play/pause button state
  const isPlaying = playbackState === 'playing';
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow bg-white dark:bg-gray-800 dark:border-gray-700 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Board Settings */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Board Size</label>
          <Select 
            value={boardSize.toString()} 
            onValueChange={(value) => onBoardSizeChange(parseInt(value))}
            disabled={isComputing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select board size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 x 3</SelectItem>
              <SelectItem value="4">4 x 4</SelectItem>
              <SelectItem value="5">5 x 5</SelectItem>
              <SelectItem value="6">6 x 6</SelectItem>
              <SelectItem value="7">7 x 7</SelectItem>
              <SelectItem value="8">8 x 8</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Animation Speed */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Animation Speed</label>
          <Select 
            value={animationSpeed.toString()} 
            onValueChange={(value) => onAnimationSpeedChange(parseInt(value) as AnimationSpeed)}
            disabled={isComputing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AnimationSpeed.Slow.toString()}>Slow</SelectItem>
              <SelectItem value={AnimationSpeed.Medium.toString()}>Medium</SelectItem>
              <SelectItem value={AnimationSpeed.Fast.toString()}>Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Mode Toggles */}
        <div className="flex space-x-2 items-end">
          <Button 
            variant={instantMode ? "default" : "outline"}
            size="icon"
            onClick={onToggleInstantMode}
            title={instantMode ? "Disable Instant Mode" : "Enable Instant Mode"}
            disabled={isComputing}
          >
            <Zap className={instantMode ? "text-yellow-400" : "text-gray-400"} size={20} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Playback Controls */}
      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBack}
          disabled={playbackState === 'stopped' || isComputing}
          title="Step Backward"
        >
          <SkipBack size={20} />
        </Button>
        
        {isPlaying ? (
          <Button
            variant="outline"
            size="icon"
            onClick={onPause}
            disabled={isComputing}
            title="Pause"
          >
            <PauseCircle size={20} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={onPlay}
            disabled={playbackState === 'finished' || isComputing}
            title="Play"
          >
            <PlayCircle size={20} />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={isComputing}
          title="Reset"
        >
          <RotateCcw size={20} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={playbackState === 'finished' || isComputing}
          title="Step Forward"
        >
          <SkipForward size={20} />
        </Button>
      </div>
      
      {isComputing && (
        <div className="text-center text-sm text-orange-500 animate-pulse">
          Computing algorithms... Please wait.
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
