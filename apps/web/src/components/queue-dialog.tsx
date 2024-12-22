import { useEffect, useState } from 'react';

import { useQuery } from 'convex/react';

import { Dialog, DialogContent } from '~/components/ui/dialog';

import { api } from '../../convex/_generated/api';

interface QueueDialogProps {
  open: boolean;
  setOpen: (open: boolean) => Promise<void>;
}

export const QueueDialog = ({ open, setOpen }: QueueDialogProps) => {
  const queueSize = useQuery(api.queue.getQueueSize);

  const [time, setTime] = useState(0);

  const onOpenChange = async (open: boolean) => {
    await setOpen(open);
    setTime(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose>
        Time: {time}
        <div>Queue Size: {queueSize}</div>
      </DialogContent>
    </Dialog>
  );
};
