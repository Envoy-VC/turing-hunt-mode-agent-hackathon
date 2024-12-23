import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getQueue } from './queue';

export const createGame = mutation({
  args: undefined,
  handler: async (ctx) => {
    const queue = await getQueue(ctx, {});
    if (queue.length === 0) {
      throw new Error('Not enough players in queue');
    }

    // randomize player order
    queue.sort(() => Math.random() - 0.5);

    const players = queue.map((player, index) => ({
      id: player._id,
      hasVoted: false,
      vote: undefined,
      address: player.address,
      index,
      tasksCompleted: [],
    }));

    const gameId = await ctx.db.insert('games', {
      players,
    });

    return { gameId, players: queue };
  },
});

export const getGame = query({
  args: {
    gameId: v.id('games'),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  },
});
