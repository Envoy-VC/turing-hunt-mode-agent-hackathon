import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const taskType = v.union(
  v.literal('fireplace'),
  v.literal('television-set'),
  v.literal('wall-table'),
  v.literal('burner'),
  v.literal('gym'),
  v.literal('entrance-cupboard'),
  v.literal('swords')
);

const abstractPlayer = v.object({
  id: v.id('users'),
  hasVoted: v.boolean(),
  index: v.number(),
  address: v.string(),
  // Address of the player voted for
  vote: v.optional(v.string()),
  tasksCompleted: v.array(taskType),
});

const schema = defineSchema({
  users: defineTable({
    address: v.string(),
  }).index('address', ['address']),
  games: defineTable({
    players: v.array(abstractPlayer),
  }),
  queue: defineTable({
    player: v.id('users'),
  }),
  messages: defineTable({
    gameId: v.id('games'),
    player: v.object({
      id: v.id('users'),
      address: v.string(),
      index: v.number(),
    }),
    content: v.string(),
  }).index('gameId', ['gameId', 'player.id']),
});

// eslint-disable-next-line import/no-default-export -- safe
export default schema;
