import { createWalletClient, encodeAbiParameters, http } from 'viem';
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
  const data = encodeAbiParameters(gameContractConfig.abi[3].inputs, [
    id,
    players,
  ]);
  const hash = await client.signTransaction({
    account,
    to: gameContractConfig.address,
    data,
  });

  return hash;
};

interface VoteForPlayerProps {
  id: string;
  player: `0x${string}`;
}

export const voteForPlayer = async ({ id, player }: VoteForPlayerProps) => {
  const data = encodeAbiParameters(gameContractConfig.abi[11].inputs, [
    id,
    player,
  ]);
  const hash = await client.signTransaction({
    account,
    to: gameContractConfig.address,
    data,
  });

  return hash;
};
