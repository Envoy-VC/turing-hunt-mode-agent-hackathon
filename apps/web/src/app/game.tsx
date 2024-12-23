import { useEffect, useRef, useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import Phaser from 'phaser';
import { useAccount } from 'wagmi';
import { z } from 'zod';
import { ChatBox } from '~/components';
import { useGameActions } from '~/hooks/use-game-actions';

import { TaskDialog } from '~/components/tasks';
import { Button } from '~/components/ui/button';

import { api } from '../../convex/_generated/api';
import { type Id } from '../../convex/_generated/dataModel';
import { WorldScene } from '../game/scenes';

export const GameComponent = () => {
  const { gameId } = Route.useSearch();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const [showChat, setShowChat] = useState<boolean>(false);

  const game = useQuery(api.game.getGame, {
    gameId: gameId as Id<'games'>,
  });

  const actions = useGameActions();

  const { address } = useAccount();

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
      <div className='absolute top-8 right-4'>
        <Button
          onClick={() => {
            setShowChat((p) => !p);
          }}
        >
          Chat
        </Button>
      </div>
      {game && showChat ? (
        <ChatBox
          gameId={gameId}
          isOpen={showChat}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined
          me={game.players.find((p) => p.address === address)!}
          others={game.players.filter((p) => p.address !== address)}
          setOpen={setShowChat}
        />
      ) : null}
    </div>
  );
};

export const Route = createFileRoute('/game')({
  component: GameComponent,
  validateSearch: z.object({
    gameId: z.string(),
  }),
});
