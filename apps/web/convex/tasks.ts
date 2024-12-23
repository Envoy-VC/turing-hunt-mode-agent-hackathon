import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { getGame } from './game';
import { taskType } from './schema';

export const completeTask = mutation({
  args: {
    gameId: v.id('games'),
    address: v.string(),
    task: taskType,
  },
  handler: async (ctx, args) => {
    const game = await getGame(ctx, { gameId: args.gameId });

    const playerIndex = game.players.findIndex(
      (player) => player.address === args.address
    );
    const players = [...game.players];
    const player = players[playerIndex];

    if (!player) {
      throw new Error('Player not found');
    }

    const tasks = Array.from(new Set([...player.tasksCompleted, args.task]));
    players[playerIndex] = { ...player, tasksCompleted: tasks };

    await ctx.db.patch(args.gameId, { players });
  },
});
