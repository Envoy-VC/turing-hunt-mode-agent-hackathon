import { useEffect, useState } from 'react';

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

  const onStartGame = async () => {
    try {
      const gameId = await startGame();
    } catch (error: unknown) {
      const message = (error as Error).message;
      toast.error(message);
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
          <Button variant='secondary' onClick={onStartGame}>
            Start Game
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
