import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import { Stage, Container } from '@pixi/react';
import { MinesweeperEngine } from '../logic/MinesweeperEngine';
import { CellSprite } from './CellSprite';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { audio } from '../logic/AudioEngine';

interface GameStageProps {
  width: number;
  height: number;
  mines: number;
  onGameOver: (win: boolean) => void;
  onFlagChange: (flagsLeft: number) => void;
}

export const GameStage = ({ width, height, mines, onGameOver, onFlagChange }: GameStageProps) => {
  const [engine] = useState(() => new MinesweeperEngine(width, height, mines));
  // Trigger re-render when board changes
  const [, setBoardTick] = useState(0);
  
  const cellSize = 40;
  const boardWidth = width * cellSize;
  const boardHeight = height * cellSize;

  // Window size for responsive stage
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxStageWidth = windowSize.w - 40; // padding
  const maxStageHeight = windowSize.h - 320; // extra padding for UI and banner
  const scale = Math.min(maxStageWidth / boardWidth, maxStageHeight / boardHeight, 1.5);
  
  const stageWidth = boardWidth * scale;
  const stageHeight = boardHeight * scale;
  
  const initialXOffset = 0;
  const initialYOffset = 0;

  // Fixed Position State
  const position = { x: initialXOffset, y: initialYOffset };
  const hasDragged = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const longPressTimer = useRef<number | null>(null);

  const triggerHaptic = async (style: ImpactStyle) => {
    try {
      await Haptics.impact({ style });
    } catch (e) {
      // Ignore if not on device or web
    }
  };

  const handleStagePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    hasDragged.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };

    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const boardX = (clickX - position.x) / scale;
    const boardY = (clickY - position.y) / scale;
    const cellX = Math.floor(boardX / cellSize);
    const cellY = Math.floor(boardY / cellSize);

    if (cellX >= 0 && cellX < width && cellY >= 0 && cellY < height) {
      longPressTimer.current = window.setTimeout(() => {
        if (!hasDragged.current) {
          triggerHaptic(ImpactStyle.Heavy);
          engine.toggleFlag(cellX, cellY);
          onFlagChange(engine.mineCount - engine.flagsPlaced);
          audio.playFlag();
          setBoardTick(t => t + 1);
        }
        longPressTimer.current = null;
      }, 400);
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // If user moves finger more than 10px, cancel tap/long-press
    if (Math.abs(e.clientX - dragStart.current.x) > 10 || Math.abs(e.clientY - dragStart.current.y) > 10) {
      hasDragged.current = true;
    }
  };

  const handleStagePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;

      if (!hasDragged.current) {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const boardX = (clickX - position.x) / scale;
        const boardY = (clickY - position.y) / scale;
        const cellX = Math.floor(boardX / cellSize);
        const cellY = Math.floor(boardY / cellSize);

        if (cellX >= 0 && cellX < width && cellY >= 0 && cellY < height) {
          triggerHaptic(ImpactStyle.Light);
          
          const cell = engine.board[cellY][cellX];
          let hitMine = false;
          
          if (cell.isRevealed && cell.neighborMines > 0) {
            // Chording (Fast Dig)
            hitMine = engine.chord(cellX, cellY);
          } else {
            // Normal reveal
            hitMine = engine.reveal(cellX, cellY);
          }
          
          setBoardTick(t => t + 1);

          if (hitMine) {
            triggerHaptic(ImpactStyle.Heavy);
            audio.playExplosion();
            onGameOver(false);
          } else if (engine.isWin) {
            triggerHaptic(ImpactStyle.Medium);
            audio.playWin();
            onGameOver(true);
          } else {
            audio.playDig();
          }
        }
      }
    }
  };

  return (
    <Stage 
      width={stageWidth} 
      height={stageHeight} 
      options={{ backgroundAlpha: 0, resolution: window.devicePixelRatio || 1, autoDensity: true }}
      style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)', touchAction: 'none' }}
      onPointerDown={handleStagePointerDown}
      onPointerMove={handleStagePointerMove}
      onPointerUp={handleStagePointerUp}
      onPointerOut={handleStagePointerUp}
      onPointerCancel={handleStagePointerUp}
    >
      <Container x={position.x} y={position.y} scale={scale}>
        {engine.board.map((row, y) => 
          row.map((cell, x) => (
            <CellSprite 
              key={`${x}-${y}`} 
              cell={cell} 
              size={cellSize} 
            />
          ))
        )}
      </Container>
    </Stage>
  );
};
