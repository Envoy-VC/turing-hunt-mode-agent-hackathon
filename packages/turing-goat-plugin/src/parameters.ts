import { z } from 'zod';

export const getGameParametersSchema = z.object({
  gameId: z.string().describe('The ID of the game to query'),
});

export const voteParametersSchema = z.object({
  gameId: z.string().describe('The ID of the game to vote on'),
  address: z.string().describe('The address of the player to vote for'),
});
