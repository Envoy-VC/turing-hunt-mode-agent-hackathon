import { useEffect, useRef } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import Phaser from 'phaser';
import { useAccount } from 'wagmi';
import { z } from 'zod';
import { ChatBox } from '~/components';
import { useGameActions } from '~/hooks/use-game-actions';

import { TaskDialog } from '~/components/tasks';
import { Button } from '~/components/ui/button';
import { VoteBox } from '~/components/vote-box';

import { api } from '../../convex/_generated/api';
import { type Id } from '../../convex/_generated/dataModel';
import { WorldScene } from '../game/scenes';

import { type Game } from '~/types/game';

export const GameComponent = () => {
  const { gameId } = Route.useSearch();

  const game = useQuery(api.game.getGame, {
    gameId: gameId as Id<'games'>,
  });

  const { address } = useAccount();

  if (!game || !address) return null;

  return <GameBox address={address} game={game} />;
};

interface GameBoxProps {
  game: Game;
  address: string;
}

const GameBox = ({ game, address }: GameBoxProps) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const actions = useGameActions(game);

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
      <div className='absolute top-8 right-4 flex flex-row gap-4'>
        <Button
          onClick={() => {
            actions.store.setIsVoteBoxOpen(!actions.store.isVoteBoxOpen);
          }}
        >
          Vote
        </Button>
        <Button
          onClick={() => {
            actions.store.setIsChatOpen(!actions.store.isChatOpen);
          }}
        >
          Chat
        </Button>
      </div>
      <ChatBox
        gameId={game._id}
        isOpen={actions.store.isChatOpen}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- should be defined
        me={game.players.find((p) => p.address === address)!}
        others={game.players.filter((p) => p.address !== address)}
        setOpen={actions.store.setIsChatOpen}
      />
      <VoteBox
        gameId={game._id}
        isOpen={actions.store.isVoteBoxOpen}
        others={game.players.filter((p) => p.address !== address)}
        setOpen={actions.store.setIsVoteBoxOpen}
      />
    </div>
  );
};

export const Route = createFileRoute('/game')({
  component: GameComponent,
  validateSearch: z.object({
    gameId: z.string(),
  }),
});
