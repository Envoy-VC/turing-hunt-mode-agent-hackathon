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
  conversations: defineTable({
    gameId: v.id('games'),
  }).index('id', ['gameId']),
  messages: defineTable({
    conversationId: v.id('conversations'),
    content: v.string(),
  }).index('conversationId', ['conversationId']),
});

// eslint-disable-next-line import/no-default-export -- safe
export default schema;
