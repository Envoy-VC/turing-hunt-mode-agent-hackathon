/* eslint-disable */

/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from 'convex/server';

import type * as chat from '../chat.js';
import type * as game from '../game.js';
import type * as player from '../player.js';
import type * as queue from '../queue.js';
import type * as tasks from '../tasks.js';
import type * as vote from '../vote.js';

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  chat: typeof chat;
  game: typeof game;
  player: typeof player;
  queue: typeof queue;
  tasks: typeof tasks;
  vote: typeof vote;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, 'public'>
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, 'internal'>
>;
