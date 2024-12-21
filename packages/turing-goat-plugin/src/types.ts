export interface Game {
  id: `0x${string}`;
  totalPlayers: number;
  startTime: bigint;
  isEnded: boolean;
  playerWithMostVotes: number;
}

export interface Vote {
  player: number;
  hasVoted: boolean;
}

export interface Player {
  player: `0x${string}`;
  vote: Vote;
}

export interface GameWithPlayers {
  game: Game;
  players: Player[];
}
