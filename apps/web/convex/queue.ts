import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { getOrCreateUser } from './player';

export const joinQueue = mutation({
  args: v.object({
    address: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await getOrCreateUser(ctx, { address: args.address });
    await ctx.db.insert('queue', {
      player: user,
    });
  },
});

export const leaveQueue = mutation({
  args: v.object({
    address: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await getOrCreateUser(ctx, { address: args.address });
    const queueEntry = await ctx.db
      .query('queue')
      .filter((q) => q.eq(q.field('player'), user))
      .first();

    if (!queueEntry) {
      return;
    }
    await ctx.db.delete(queueEntry._id);
  },
});

export const getQueue = mutation({
  args: undefined,
  handler: async (ctx) => {
    return await ctx.db.query('queue').order('asc').take(10);
  },
});

export const getQueueSize = query({
  args: undefined,
  handler: async (ctx) => {
    return (await ctx.db.query('queue').collect()).length;
  },
});
