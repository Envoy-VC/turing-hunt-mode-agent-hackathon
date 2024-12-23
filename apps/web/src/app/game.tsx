import { useEffect, useRef } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import Phaser from 'phaser';
import { z } from 'zod';
import { useGameActions } from '~/hooks/use-game-actions';

import { TaskDialog } from '~/components/tasks';

import { WorldScene } from '../game/scenes';

export const GameComponent = () => {
  const { gameId } = Route.useSearch();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const actions = useGameActions();

  useEffect(() => {
    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        width: 40 * 16,
        height: 20 * 16,
        type: Phaser.AUTO,
        scene: [new WorldScene(actions)],
        scale: {
          width: '100%',
          height: '100%',
        },
        parent: 'game-container',
        pixelArt: true,
        physics: {
          default: 'arcade',
          arcade: {
            debug: true,
            gravity: { y: 0, x: 1 },
          },
        },
      };

      const phaserGame = new Phaser.Game(config);
      phaserGameRef.current = phaserGame;
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div className='h-screen w-screen border border-white'>
      <TaskDialog
        interactionType={actions.store.taskType}
        open={actions.store.isTaskDialogOpen}
        onOpenChange={actions.store.setIsTaskDialogOpen}
      />
      <div ref={gameContainerRef} id='game-container' />
    </div>
  );
};

export const Route = createFileRoute('/game')({
  component: GameComponent,
  validateSearch: z.object({
    gameId: z.string(),
  }),
});
