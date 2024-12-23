import { truncate } from '~/lib/utils';
import { gameContractConfig } from '~/lib/wagmi';

import { useMutation } from 'convex/react';
import { useAccount, useWriteContract } from 'wagmi';

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

export interface VoteBoxProps {
  others: GamePlayer[];
  gameId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const VoteBox = ({ isOpen, setOpen, gameId, others }: VoteBoxProps) => {
  const { address } = useAccount();
  const voteForPlayer = useMutation(api.vote.vote);

  const { writeContractAsync } = useWriteContract();

  const onVote = async (player: `0x${string}`) => {
    if (!address) return;
    await writeContractAsync({
      ...gameContractConfig,
      functionName: 'vote',
      args: [gameId, player],
    });
    await voteForPlayer({
      gameId: gameId as Id<'games'>,
      address,
      voteeAddress: player,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className='font-body !w-[40dvw] !rounded-none border-[10px] border-[rgb(23,20,33)] bg-[rgb(35,38,58)] text-neutral-100'>
        <SheetHeader>
          <SheetTitle className='text-neutral-100'>
            Vote for the Imposter
          </SheetTitle>
          <SheetDescription className='flex flex-col gap-2'>
            <div className='hide-scrollbar flex h-[90dvh] flex-col justify-between gap-2 overflow-y-scroll'>
              <div className='flex flex-col gap-3'>
                {others.map((player) => (
                  <div
                    key={player.address}
                    className='flex flex-row items-center justify-between gap-2'
                  >
                    <div className='flex flex-row items-center gap-2'>
                      <div className='h-8 w-8 rounded-full bg-[#3A4466]' />
                      <div className='font-mono text-neutral-100'>
                        {truncate(player.address, 10)}
                      </div>
                    </div>
                    <Button
                      onClick={() => onVote(player.address as `0x${string}`)}
                    >
                      Vote
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
