import { v } from 'convex/values';

import { mutation } from './_generated/server';

export const getOrCreateUser = mutation({
  args: v.object({
    address: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('address'), args.address))
      .first();

    if (!user) {
      const userId = await ctx.db.insert('users', {
        address: args.address,
      });

      return userId;
    }

    return user._id;
  },
});
