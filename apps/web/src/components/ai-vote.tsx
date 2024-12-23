import { voteForGame } from '~/lib/ai';

import { useMutation } from 'convex/react';

import { api } from '../../convex/_generated/api';
import { Button } from './ui/button';

import { type Game } from '~/types/game';

export const AIVote = (game: Game) => {
  const getMessages = useMutation(api.chat.getChatMessagesMutation);
  return (
    <Button
      onClick={async () => {
        const m = await getMessages({ gameId: game._id });
        const messages = m.map((m) => ({
          address: m.player.address,
          message: m.content,
        }));
        await voteForGame(game._id, game.players.length, messages);
      }}
    >
      AIVote
    </Button>
  );
};
