import { createWalletClient, encodeFunctionData, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { modeTestnet } from 'viem/chains';

import { gameContractConfig } from '.';

const account = privateKeyToAccount(import.meta.env.VITE_PUBLIC_ADMIN_PK);

export const agentWalletClient = createWalletClient({
  chain: modeTestnet,
  transport: http(),
  account,
});

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

  const hash = await agentWalletClient.sendTransaction({
    account,
    to: gameContractConfig.address,
    data,
    value: BigInt(0),
  });

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

  const hash = await agentWalletClient.sendTransaction({
    account,
    to: gameContractConfig.address,
    data,
    value: BigInt(0),
  });

  return hash;
};
