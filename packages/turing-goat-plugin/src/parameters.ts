import { z } from 'zod';

export const getGameParametersSchema = z.object({
  gameId: z.string().describe('The ID of the game to query (hex string)'),
});

export const voteParametersSchema = z.object({
  gameId: z.string().describe('The ID of the game to vote on (hex string)'),
  address: z
    .string()
    .describe('The address of the player to vote for (hex string)'),
});
