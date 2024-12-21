import type { EVMWalletClient } from '@goat-sdk/wallet-evm';
import type { z } from 'zod';

import { TURING_HUNT_ABI } from './abi';
import { TURING_HUNT_CONTRACT_ADDRESS } from './constants';
import type {
  getGameParametersSchema,
  voteParametersSchema,
} from './parameters';
import type { GameWithPlayers } from './types';

export const getGame = async (
  walletClient: EVMWalletClient,
  parameters: z.infer<typeof getGameParametersSchema>
) => {
  try {
    const res = await walletClient.read({
      address: TURING_HUNT_CONTRACT_ADDRESS,
      abi: TURING_HUNT_ABI,
      functionName: 'getGame',
      args: [parameters.gameId],
    });

    return res.value as GameWithPlayers;
  } catch (error) {
    throw new Error(`Error getting game: ${String(error)}`);
  }
};

export const vote = async (
  walletClient: EVMWalletClient,
  parameters: z.infer<typeof voteParametersSchema>
): Promise<string> => {
  try {
    const res = await walletClient.sendTransaction({
      to: TURING_HUNT_CONTRACT_ADDRESS,
      abi: TURING_HUNT_ABI,
      functionName: 'vote',
      args: [parameters.gameId, parameters.address],
    });
    return res.hash;
  } catch (error) {
    throw new Error(`Error voting: ${String(error)}`);
  }
};
