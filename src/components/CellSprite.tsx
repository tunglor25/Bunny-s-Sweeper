// @ts-nocheck
// @ts-ignore
import { Container, Graphics, Sprite, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useCallback } from 'react';
import type { Cell } from '../logic/MinesweeperEngine';

interface CellSpriteProps {
  cell: Cell;
  size: number;
}

export const CellSprite = ({ cell, size }: CellSpriteProps) => {
  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return '#60a5fa'; // Light Blue
      case 2: return '#4ade80'; // Light Green
      case 3: return '#f87171'; // Light Red
      case 4: return '#c084fc'; // Light Purple
      case 5: return '#fb923c'; // Orange
      case 6: return '#22d3ee'; // Cyan
      case 7: return '#facc15'; // Yellow
      case 8: return '#f43f5e'; // Rose
      default: return '#ffffff';
    }
  };

  const drawDirt = useCallback((g: PIXI.Graphics) => {
    g.clear();
    const w = size - 2;
    const h = size - 2;
    const r = 8;
    
    // Drop shadow
    g.beginFill(0x000000, 0.25);
    g.drawRoundedRect(0, 3, w, h, r);
    g.endFill();
    
    // 3D Bottom Lip
    g.beginFill(0x4d7c0f); 
    g.drawRoundedRect(0, 0, w, h, r);
    g.endFill();
    
    // Top Grass Surface
    g.beginFill(0x84cc16); 
    g.drawRoundedRect(0, 0, w, h - 8, r);
    g.endFill();

    // Top Edge Highlight (Glassy/Plastic reflection)
    g.beginFill(0xd9f99d, 0.7);
    g.drawRoundedRect(2, 2, w - 4, 6, 6);
    g.endFill();

    // Bottom Inner Shadow for rounded surface feel
    g.beginFill(0x65a30d);
    g.drawRoundedRect(2, h - 14, w - 4, 6, 4);
    g.endFill();
  }, [size]);

  const drawRevealed = useCallback((g: PIXI.Graphics) => {
    g.clear();
    const w = size - 2;
    const h = size - 2;
    const r = 8;

    // Rim of the hole (outer border)
    g.beginFill(0x462b18); 
    g.drawRoundedRect(0, 0, w, h, r);
    g.endFill();

    // Inner Hole Shadow (Depth)
    g.beginFill(0x2d1a0e);
    g.drawRoundedRect(0, 4, w, h - 4, r);
    g.endFill();
    
    // The dirt floor (Bottom of the hole)
    g.beginFill(0x7a4d30);
    g.drawRoundedRect(0, 8, w, h - 8, r);
    g.endFill();

    // Inner Highlight on dirt floor
    g.beginFill(0x93603f);
    g.drawRoundedRect(2, 8, w - 4, 4, 4);
    g.endFill();

    // Deep shadow (top inner rim)
    g.beginFill(0x3a2210); 
    g.drawRoundedRect(0, 0, w, h, r);
    g.endFill();
    
    // Bottom floor (Warm, rich soil)
    g.beginFill(0x7a4d30); 
    g.drawRoundedRect(0, 4, w, h - 4, r);
    g.endFill();
    
    // Texture: Little dirt particles & pebbles
    // Darker pebbles
    g.beginFill(0x5c3a21);
    g.drawCircle(w * 0.25, h * 0.35, 2.5);
    g.drawCircle(w * 0.75, h * 0.75, 2);
    g.drawCircle(w * 0.65, h * 0.25, 1.5);
    g.endFill();

    // Lighter highlight pebbles
    g.beginFill(0x93603f); 
    g.drawCircle(w * 0.2, h * 0.8, 2);
    g.drawCircle(w * 0.8, h * 0.4, 1.5);
    g.endFill();
  }, [size]);

  const xPos = cell.x * size;
  const yPos = cell.y * size;
  const renderSize = size - 1;

  return (
    <Container x={xPos} y={yPos}>
      {!cell.isRevealed ? (
        <>
          <Graphics draw={drawDirt} />
          {!cell.isFlagged && (
            <Sprite 
              image="/carrot_bg.svg" 
              x={size / 2} 
              y={size / 2} 
              anchor={0.5} 
              width={size * 0.75}
              height={size * 0.75}
            />
          )}
          {cell.isFlagged && (
            <Sprite 
              image="/farm_sign.svg" 
              x={size / 2} 
              y={size / 2} 
              anchor={0.5} 
              width={size * 0.75}
              height={size * 0.75}
            />
          )}
        </>
      ) : (
        <>
          <Graphics draw={drawRevealed} />
          {cell.isMine ? (
            <Sprite 
              image="/mole_mine.svg" 
              x={size / 2} 
              y={size / 2} 
              anchor={0.5} 
              width={size * 0.8}
              height={size * 0.8}
            />
          ) : (
            <>
              {cell.neighborMines > 0 && (
                <Text 
                  text={cell.neighborMines.toString()} 
                  x={size / 2} 
                  y={size / 2} 
                  anchor={0.5} 
                  style={new PIXI.TextStyle({ 
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: size * 0.75, 
                    fontWeight: '900', 
                    fill: getNumberColor(cell.neighborMines),
                    stroke: '#291c13',
                    strokeThickness: 5,
                    dropShadow: true,
                    dropShadowColor: '#000000',
                    dropShadowAlpha: 0.6,
                    dropShadowBlur: 2,
                    dropShadowDistance: 2,
                  })}
                />
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};
