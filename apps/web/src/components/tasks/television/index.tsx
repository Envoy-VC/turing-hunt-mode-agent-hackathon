'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';

import {
  type GameState,
  type Wire,
  checkSolution,
  connectWire,
  generateWires,
} from './utils';

/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
/* eslint-disable no-nested-ternary -- safe */
/* eslint-disable @typescript-eslint/restrict-template-expressions -- safe */

export const TelevisionTask = () => {
  const [gameState, setGameState] = useState<GameState>({
    wires: [],
    selectedWire: null,
    isSolved: false,
    dragEndY: null,
    isChecked: false,
  });

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGameState({
      wires: generateWires(),
      selectedWire: null,
      isSolved: false,
      dragEndY: null,
      isChecked: false,
    });
  };

  const handleWireMouseDown = (wireId: number) => {
    setGameState((prevState) => ({
      ...prevState,
      selectedWire: wireId,
      isChecked: false,
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (gameState.selectedWire !== null) {
      const svgRect = e.currentTarget.getBoundingClientRect();
      const y = ((e.clientY - svgRect.top) / svgRect.height) * 100;
      setGameState((prevState) => ({
        ...prevState,
        dragEndY: Math.max(0, Math.min(100, y)),
      }));
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (gameState.selectedWire !== null) {
      const svgRect = e.currentTarget.getBoundingClientRect();
      const y = ((e.clientY - svgRect.top) / svgRect.height) * 100;
      const endY = Math.max(0, Math.min(100, y));
      setGameState((prevState) =>
        connectWire(prevState, prevState.selectedWire!, endY)
      );
    }
  };

  const handleCheck = () => {
    const isSolved = checkSolution(gameState.wires);
    setGameState((prevState) => ({ ...prevState, isSolved, isChecked: true }));
  };

  const renderWire = (wire: Wire) => {
    const startX = 10;
    const endX = 90;

    return (
      <g key={wire.id}>
        <circle
          className='hover:drop-shadow-glow cursor-pointer hover:filter'
          cx={startX}
          cy={wire.startY}
          fill={wire.color}
          r='3'
          stroke='white'
          strokeWidth='1'
          onMouseDown={() => handleWireMouseDown(wire.id)}
        />
        <circle
          className='hover:drop-shadow-glow cursor-pointer hover:filter'
          cx={endX}
          cy={wire.correctEndY}
          fill={wire.color}
          r='3'
          stroke='white'
          strokeWidth='1'
        />
        {wire.isConnected ? (
          <path
            d={`M${startX},${wire.startY} C${startX + 30},${wire.startY} ${endX - 30},${wire.endY!} ${endX},${wire.endY!}`}
            fill='none'
            stroke={wire.color}
            strokeWidth='2'
            className={
              gameState.isChecked
                ? wire.endY === wire.correctEndY
                  ? 'animate-pulse'
                  : 'opacity-50'
                : ''
            }
          />
        ) : null}
        {gameState.selectedWire === wire.id && gameState.dragEndY !== null && (
          <path
            className='animate-pulse'
            d={`M${startX},${wire.startY} C${startX + 30},${wire.startY} ${endX - 30},${gameState.dragEndY} ${endX},${gameState.dragEndY}`}
            fill='none'
            stroke={wire.color}
            strokeDasharray='4 2'
            strokeWidth='2'
          />
        )}
      </g>
    );
  };

  return (
    <div className='flex flex-col items-center justify-center p-4 text-white'>
      <div className='relative aspect-square w-full max-w-md overflow-hidden rounded-lg border-4 border-gray-700 bg-gray-800 shadow-lg'>
        <div className='absolute inset-0 bg-black opacity-20' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <svg
            className='h-full w-full'
            preserveAspectRatio='none'
            viewBox='0 0 100 100'
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() =>
              setGameState((prevState) => ({
                ...prevState,
                selectedWire: null,
                dragEndY: null,
              }))
            }
          >
            {gameState.wires.map(renderWire)}
          </svg>
        </div>
      </div>
      <div className='mt-8 space-y-4'>
        <p className='text-center text-xl'>
          {gameState.isSolved
            ? "Great job! You've fixed the wires."
            : gameState.isChecked
              ? 'Not quite right. Keep trying!'
              : 'Connect the matching colored wires!'}
        </p>
        <div className='flex justify-center space-x-4'>
          <Button
            className='rounded-full bg-blue-600 px-6 py-2 text-lg font-semibold transition-colors duration-300 hover:bg-blue-700'
            disabled={gameState.isSolved}
            onClick={handleCheck}
          >
            Check
          </Button>
          <Button
            className='rounded-full bg-red-600 px-6 py-2 text-lg font-semibold transition-colors duration-300 hover:bg-red-700'
            onClick={resetGame}
          >
            {gameState.isSolved ? 'Play Again' : 'Reset'}
          </Button>
        </div>
      </div>
    </div>
  );
};
