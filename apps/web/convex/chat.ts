import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getGame } from './game';

export const sendChatMessage = mutation({
  args: {
    gameId: v.id('games'),
    address: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGame(ctx, { gameId: args.gameId });
    const player = game.players.find(
      (player) => player.address === args.address
    );

    if (!player) {
      throw new Error('Player not found');
    }

    return await ctx.db.insert('messages', {
      gameId: args.gameId,
      player: {
        id: player.id,
        address: args.address,
        index: player.index,
      },
      content: args.content,
    });
  },
});

export const getChatMessages = query({
  args: {
    gameId: v.id('games'),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('gameId'), args.gameId))
      .order('asc')
      .collect();

    return messages;
  },
});
