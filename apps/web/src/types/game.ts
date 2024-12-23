import { type api } from '../../convex/_generated/api';

export type InteractionType =
  | 'fireplace'
  | 'television-set'
  | 'wall-table'
  | 'burner'
  | 'gym'
  | 'entrance-cupboard'
  | 'swords';

export type Game = typeof api.game.getGame._returnType;
export type GamePlayer = Game['players'][0];
export type ChatMessage = (typeof api.chat.getChatMessages._returnType)[0];
