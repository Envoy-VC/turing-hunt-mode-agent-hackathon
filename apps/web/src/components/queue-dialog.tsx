import { useEffect, useState } from 'react';

import { wagmiConfig } from '~/lib/wagmi';
import { createGame } from '~/lib/wagmi/actions';

import { useNavigate } from '@tanstack/react-router';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';

import { Dialog, DialogContent } from '~/components/ui/dialog';

import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';

interface QueueDialogProps {
  open: boolean;
  setOpen: (open: boolean) => Promise<void>;
}

export const QueueDialog = ({ open, setOpen }: QueueDialogProps) => {
  const queueSize = useQuery(api.queue.getQueueSize);

  const [time, setTime] = useState<`${string}:${string}`>('00:00');

  const startGame = useMutation(api.game.createGame);
  const navigate = useNavigate();

  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const onStartGame = async () => {
    try {
      setIsCreatingGame(true);
      const { gameId, players } = await startGame();
      console.log({ gameId, players });
      const hash = await createGame({
        id: gameId,
        players: players.map((p) => p.address as `0x${string}`),
      });
      await waitForTransactionReceipt(wagmiConfig, { hash });
      await navigate({
        to: '/game',
        search: { gameId },
      });
    } catch (error: unknown) {
      const message = (error as Error).message;
      toast.error(message);
    } finally {
      setIsCreatingGame(false);
    }
  };

  const onOpenChange = async (open: boolean) => {
    await setOpen(open);
    setTime('00:00');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => {
        const [minutes, seconds] = time.split(':').map(Number) as [
          number,
          number,
        ];
        const newSeconds = seconds === 59 ? 0 : seconds + 1;
        const newMinutes = seconds === 59 ? minutes + 1 : minutes;
        return `${String(newMinutes).padStart(2, '0')}:${String(
          newSeconds
        ).padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className='flex flex-col items-center justify-center gap-4 border-none bg-transparent font-mono text-white'
      >
        <div>In Queue</div>
        <div className='text-6xl'>{time}</div>

        <div>Players in Queue: {queueSize?.toString() ?? '0'}</div>
        {(queueSize ?? 0) >= 1 && (
          <Button
            disabled={isCreatingGame}
            variant='secondary'
            onClick={onStartGame}
          >
            {isCreatingGame ? 'Creating Game...' : 'Start Game'}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
