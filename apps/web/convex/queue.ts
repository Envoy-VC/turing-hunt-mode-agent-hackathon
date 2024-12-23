import { v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { getOrCreateUser } from './player';

export const joinQueue = mutation({
  args: v.object({
    address: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await getOrCreateUser(ctx, { address: args.address });
    const queueEntry = await ctx.db
      .query('queue')
      .filter((q) => q.eq(q.field('player'), user))
      .first();
    if (queueEntry) return;
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
    const queue = await ctx.db.query('queue').order('asc').take(9);
    queue.push({
      _id: 'random' as Id<'queue'>,
      player: 'jd734377v4mrvfbjesw8n2wy8n770t4w' as Id<'users'>,
      _creationTime: Date.now(),
    });
    const users = await Promise.all(
      queue.map(async (entry) => {
        const user = (await ctx.db.get(entry.player)) as {
          _id: Id<'users'>;
          _creationTime: number;
          address: string;
        };
        return user;
      })
    );

    return users;
  },
});

export const getQueueSize = query({
  args: undefined,
  handler: async (ctx) => {
    return (await ctx.db.query('queue').collect()).length;
  },
});
