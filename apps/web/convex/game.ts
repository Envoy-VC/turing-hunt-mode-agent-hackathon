import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getQueue } from './queue';

export const createGame = mutation({
  args: undefined,
  handler: async (ctx) => {
    const queue = await getQueue(ctx, {});
    if (queue.length <= 1) {
      throw new Error('Not enough players in queue');
    }

    const players = queue.map((player) => ({
      id: player.player,
      hasVoted: false,
      vote: undefined,
      tasksCompleted: [],
    }));
    const gameId = await ctx.db.insert('games', {
      players,
    });

    return gameId;
  },
});

export const getGame = query({
  args: {
    gameId: v.id('games'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});
