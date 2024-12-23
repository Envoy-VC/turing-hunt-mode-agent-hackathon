import { useState } from 'react';

import { cn } from '~/lib/utils';

import { useNavigate } from '@tanstack/react-router';
import { useMutation } from 'convex/react';
import { useAccount, useDisconnect } from 'wagmi';

import { api } from '../../convex/_generated/api';
import { QueueDialog } from './queue-dialog';
import { SignIn } from './sign-in';

export const HomeMenu = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const [isInQueue, setIsInQueue] = useState(false);

  const joinQueue = useMutation(api.queue.joinQueue);
  const leaveQueue = useMutation(api.queue.leaveQueue);

  const onOpenChange = async (open: boolean) => {
    if (!address) return;
    if (open) {
      // await joinQueue({ address });
      setIsInQueue(true);
    } else {
      // await leaveQueue({ address });
      setIsInQueue(false);
    }
  };

  const items = [
    {
      name: 'Play',
      key: 'play',
      onClick: async () => {
        await onOpenChange(true);
      },
    },
    {
      name: 'Profile',
      key: 'profile',
      onClick: () =>
        navigate({
          to: '/',
        }),
    },
    {
      name: 'Settings',
      key: 'settings',
      onClick: () => true,
    },
    {
      name: 'Sign Out',
      key: 'sign-out',
      onClick: () => disconnect(),
    },
  ];

  const [hovered, setHovered] = useState<string | null>(null);

  if (!address) return <SignIn />;

  return (
    <>
      <QueueDialog open={isInQueue} setOpen={onOpenChange} />
      {!isInQueue && (
        <div className='flex translate-y-12 flex-col items-center'>
          {items.map((item) => (
            <button
              key={item.key}
              type='button'
              className={cn(
                'py-2 !font-storm text-5xl tracking-wide transition-all duration-200 ease-in-out',
                (hovered ?? 'play') === item.key
                  ? 'scale-[108%] text-neutral-100'
                  : 'scale-100 text-neutral-300'
              )}
              onClick={item.onClick}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
