export const TURING_HUNT_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: 'initialOwner', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'MAX_PLAYERS',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MIN_PLAYERS',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createGame',
    inputs: [
      { name: '_id', type: 'bytes32', internalType: 'bytes32' },
      { name: '_players', type: 'address[]', internalType: 'address[]' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'games',
    inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [
      { name: 'id', type: 'bytes32', internalType: 'bytes32' },
      { name: 'totalPlayers', type: 'uint8', internalType: 'uint8' },
      { name: 'startTime', type: 'uint256', internalType: 'uint256' },
      { name: 'isEnded', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGame',
    inputs: [{ name: '_gameId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct TuringHunt.GameWithPlayers',
        components: [
          {
            name: 'game',
            type: 'tuple',
            internalType: 'struct TuringHunt.Game',
            components: [
              { name: 'id', type: 'bytes32', internalType: 'bytes32' },
              { name: 'totalPlayers', type: 'uint8', internalType: 'uint8' },
              { name: 'startTime', type: 'uint256', internalType: 'uint256' },
              { name: 'isEnded', type: 'bool', internalType: 'bool' },
            ],
          },
          {
            name: 'players',
            type: 'tuple[]',
            internalType: 'struct TuringHunt.Player[]',
            components: [
              { name: 'player', type: 'address', internalType: 'address' },
              {
                name: 'vote',
                type: 'tuple',
                internalType: 'struct TuringHunt.Vote',
                components: [
                  { name: 'player', type: 'uint8', internalType: 'uint8' },
                  { name: 'hasVoted', type: 'bool', internalType: 'bool' },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasEveryoneVoted',
    inputs: [{ name: '_gameId', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'players',
    inputs: [
      { name: '', type: 'bytes32', internalType: 'bytes32' },
      { name: '', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'vote',
    inputs: [
      { name: '_gameId', type: 'bytes32', internalType: 'bytes32' },
      { name: '_votee', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'votes',
    inputs: [
      { name: '', type: 'bytes32', internalType: 'bytes32' },
      { name: '', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [
      { name: 'player', type: 'uint8', internalType: 'uint8' },
      { name: 'hasVoted', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GameCreated',
    inputs: [
      {
        name: 'gameId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'players',
        type: 'address[]',
        indexed: false,
        internalType: 'address[]',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GameEnded',
    inputs: [
      {
        name: 'gameId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'winner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlayerVoted',
    inputs: [
      {
        name: 'gameId',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'player',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'votee',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'GameNotFound',
    inputs: [{ name: 'gameId', type: 'bytes32', internalType: 'bytes32' }],
  },
  { type: 'error', name: 'NotEnoughPlayers', inputs: [] },
  {
    type: 'error',
    name: 'NotEveryoneVoted',
    inputs: [{ name: 'gameId', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'PlayerAlreadyVoted',
    inputs: [
      { name: 'gameId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'player', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'PlayerNotFound',
    inputs: [
      { name: 'gameId', type: 'bytes32', internalType: 'bytes32' },
      { name: 'player', type: 'address', internalType: 'address' },
    ],
  },
  { type: 'error', name: 'TooManyPlayers', inputs: [] },
] as const;
