import { useState } from 'react';

import { cn } from '~/lib/utils';

import { useMutation, useQuery } from 'convex/react';
import { useAccount } from 'wagmi';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';

import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/button';

import type { GamePlayer } from '~/types/game';

export interface ChatBoxProps {
  me: GamePlayer;
  others: GamePlayer[];
  gameId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const ChatBox = ({ isOpen, setOpen, gameId }: ChatBoxProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className='font-body !w-[40dvw] !rounded-none border-[10px] border-[rgb(23,20,33)] bg-[rgb(35,38,58)] text-neutral-100'>
        <SheetHeader>
          <SheetTitle className='text-neutral-100'>
            Chat with other Players
          </SheetTitle>
          <SheetDescription className='flex flex-col gap-2'>
            <ChatContainer gameId={gameId} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export const ChatContainer = ({ gameId }: { gameId: string }) => {
  const { address } = useAccount();
  const [message, setMessage] = useState<string>('');
  const messages = useQuery(api.chat.getChatMessages, {
    gameId: gameId as Id<'games'>,
  });

  const sendMessage = useMutation(api.chat.sendChatMessage);

  const onSend = async () => {
    if (!address) return;
    await sendMessage({
      gameId: gameId as Id<'games'>,
      address,
      content: message,
    });
    setMessage('');
  };

  return (
    <div className='hide-scrollbar flex h-[90dvh] flex-col justify-between gap-2 overflow-y-scroll'>
      <div className='flex w-full flex-col gap-2 px-4'>
        {messages?.map((m) => {
          return (
            <div
              key={m._id}
              className={cn(
                'flex',
                m.player.address !== address ? 'justify-start' : 'justify-end'
              )}
            >
              <div
                className={cn(
                  'w-fit rounded-lg bg-[#3A4466] p-2 font-mono',
                  m.player.address !== address
                    ? 'text-[#8B9BB4]'
                    : 'text-neutral-300'
                )}
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex flex-row gap-2'>
        <input
          className='w-full rounded-2xl bg-[#3A4466] p-3 font-mono text-neutral-100 outline-none'
          placeholder='Type your message here'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void onSend();
            }
          }}
        />
        <div className='flex flex-row items-center gap-2'>
          <Button onClick={onSend}>Send</Button>
        </div>
      </div>
    </div>
  );
};
