import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { getGame } from './game';

export const vote = mutation({
  args: {
    gameId: v.id('games'),
    address: v.string(),
    voteeAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGame(ctx, { gameId: args.gameId });

    const playerIndex = game.players.findIndex(
      (player) => player.id === args.address
    );
    const players = [...game.players];
    const player = players[playerIndex];

    if (!player) {
      throw new Error('Player not found');
    }

    const voteeExists = game.players.some(
      (player) => player.id === args.voteeAddress
    );

    if (!voteeExists) {
      throw new Error('Votee not found');
    }
    players[playerIndex] = {
      ...player,
      hasVoted: true,
      vote: args.voteeAddress,
    };
    await ctx.db.patch(args.gameId, { players });
  },
});
