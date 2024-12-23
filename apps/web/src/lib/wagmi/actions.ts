import { createWalletClient, encodeFunctionData, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { modeTestnet } from 'viem/chains';

import { gameContractConfig } from '.';

const client = createWalletClient({
  chain: modeTestnet,
  transport: http(),
});

const account = privateKeyToAccount(import.meta.env.VITE_PUBLIC_ADMIN_PK);

interface CreateGameProps {
  id: string;
  players: `0x${string}`[];
}

export const createGame = async ({ id, players }: CreateGameProps) => {
  const data = encodeFunctionData({
    abi: gameContractConfig.abi,
    functionName: 'createGame',
    args: [id, players],
  });
  console.log(data);
  const hash = await client.sendTransaction({
    account,
    to: gameContractConfig.address,
    data,
    value: BigInt(0),
  });
  console.log(hash);

  return hash;
};

interface VoteForPlayerProps {
  id: string;
  player: `0x${string}`;
}

export const voteForPlayer = async ({ id, player }: VoteForPlayerProps) => {
  const data = encodeFunctionData({
    abi: gameContractConfig.abi,
    functionName: 'vote',
    args: [id, player],
  });

  const hash = await client.signTransaction({
    account,
    to: gameContractConfig.address,
    data,
  });

  return hash;
};
