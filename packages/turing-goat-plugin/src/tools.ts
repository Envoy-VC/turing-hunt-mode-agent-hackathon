import { type ToolBase, createTool } from '@goat-sdk/core';
import type { EVMWalletClient } from '@goat-sdk/wallet-evm';
import type { z } from 'zod';

import { getGame, vote } from './methods';
import { getGameParametersSchema, voteParametersSchema } from './parameters';

export function getTools(walletClient: EVMWalletClient): ToolBase[] {
  const tools: ToolBase[] = [];

  const getGameTool = createTool(
    {
      name: `get_game`,
      description: `This {{tool}} gets the game with the specified Game ID`,
      parameters: getGameParametersSchema,
    },
    (parameters: z.infer<typeof getGameParametersSchema>) =>
      getGame(walletClient, parameters)
  );

  const voteTool = createTool(
    {
      name: `vote`,
      description: `This {{tool}} votes for the specified player address for a Game ID`,
      parameters: voteParametersSchema,
    },
    (parameters: z.infer<typeof voteParametersSchema>) =>
      vote(walletClient, parameters)
  );

  tools.push(getGameTool, voteTool);

  return tools;
}
