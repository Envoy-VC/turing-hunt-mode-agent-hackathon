import { useEffect, useRef } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import Phaser from 'phaser';

import { WorldScene } from '../game/scenes';

export const GameComponent = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        width: 40 * 16,
        height: 20 * 16,
        type: Phaser.AUTO,
        scene: [WorldScene],
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

  return <div ref={gameContainerRef} id='game-container' />;
};

export const Route = createFileRoute('/')({
  component: GameComponent,
});
