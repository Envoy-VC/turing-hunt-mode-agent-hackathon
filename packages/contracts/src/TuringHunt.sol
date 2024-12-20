// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TuringHunt is Ownable {
    /// ========================================================
    ///                        Constants
    /// ========================================================
    uint8 public constant MAX_PLAYERS = 10;
    uint8 public constant MIN_PLAYERS = 2;

    /// ========================================================
    ///                        Errors
    /// ========================================================
    error NotEnoughPlayers();
    error TooManyPlayers();
    error PlayerNotFound(bytes32 gameId, address player);
    error GameNotFound(bytes32 gameId);
    error NotEveryoneVoted(bytes32 gameId);
    error PlayerAlreadyVoted(bytes32 gameId, address player);

    /// ========================================================
    ///                        Structs
    /// ========================================================
    struct Game {
        bytes32 id;
        uint8 totalPlayers;
        uint256 startTime;
        bool isEnded;
    }

    struct Vote {
        uint8 player;
        bool hasVoted;
    }

    struct Player {
        address player;
        Vote vote;
    }

    struct GameWithPlayers {
        Game game;
        Player[] players;
    }

    /// ========================================================
    ///                        State
    /// ========================================================

    /// @dev Mapping of game id to game struct
    mapping(bytes32 => Game) public games;

    /// @dev Mapping of GameId => PlayerIndex => PlayerAddress
    mapping(bytes32 => mapping(uint8 => address)) public players;

    /// @dev Mapping of GameId => PlayerIndex => Vote
    mapping(bytes32 => mapping(uint8 => Vote)) public votes;

    /// ========================================================
    ///                        Events
    /// ========================================================

    event GameCreated(bytes32 indexed gameId, address[] players);
    event PlayerVoted(bytes32 indexed gameId, address indexed player, address indexed votee);
    event GameEnded(bytes32 indexed gameId, address indexed winner);

    /// ========================================================
    ///                        Constructor
    /// ========================================================
    constructor(address initialOwner) Ownable(initialOwner) {}

    /// ========================================================
    ///                        Write Functions
    /// ========================================================

    /// @notice Create a new game
    /// @param _id The id of the game
    /// @param _players The addresses of the players
    /// @dev Reverts if the number of players is less than MIN_PLAYERS or greater than MAX_PLAYERS
    function createGame(bytes32 _id, address[] memory _players) public payable {
        uint8 totalPlayers = uint8(_players.length);
        if (totalPlayers < MIN_PLAYERS) {
            revert NotEnoughPlayers();
        }
        if (totalPlayers > MAX_PLAYERS) {
            revert TooManyPlayers();
        }

        games[_id] = Game({id: _id, totalPlayers: totalPlayers, startTime: block.timestamp, isEnded: false});

        for (uint8 i = 0; i < totalPlayers; i++) {
            players[_id][i] = _players[i];
        }

        emit GameCreated(_id, _players);
    }

    /// @notice Vote for AI Agent
    /// @param _gameId The id of the game
    /// @param _votee The address of the player to vote for
    /// @dev Reverts if the game does not exist, the player has already voted, or not all players have voted
    function vote(bytes32 _gameId, address _votee) public {
        ensureGameExists(_gameId);
        ensurePlayerHasNotVoted(_gameId, msg.sender);

        uint8 playerIndex = getPlayerIndex(_gameId, msg.sender);
        uint8 voteeIndex = getPlayerIndex(_gameId, _votee);

        votes[_gameId][playerIndex] = Vote({player: voteeIndex, hasVoted: true});

        endGame(_gameId);

        emit PlayerVoted(_gameId, msg.sender, _votee);
    }

    /// ========================================================
    ///                        Read Functions
    /// ========================================================

    /// @notice Get the game with players
    /// @param _gameId The id of the game
    /// @return The game with players
    function getGame(bytes32 _gameId) public view returns (GameWithPlayers memory) {
        Game memory game = games[_gameId];
        Player[] memory playersWithVotes = new Player[](game.totalPlayers);

        for (uint8 i = 0; i < game.totalPlayers; i++) {
            playersWithVotes[i] = Player({player: players[_gameId][i], vote: votes[_gameId][i]});
        }

        return GameWithPlayers({game: game, players: playersWithVotes});
    }

    /// ========================================================
    ///                    Internal Functions
    /// ========================================================

    /// @notice Get the index of a player in a game
    /// @param _gameId The id of the game
    /// @param _player The address of the player
    /// @return The index of the player
    /// @dev Reverts if the player is not found
    function getPlayerIndex(bytes32 _gameId, address _player) internal view returns (uint8) {
        for (uint8 i = 0; i < games[_gameId].totalPlayers; i++) {
            if (players[_gameId][i] == _player) {
                return i;
            }
        }

        revert PlayerNotFound(_gameId, _player);
    }

    /// @notice Check if all players have voted
    /// @param _gameId The id of the game
    /// @return boolean indicating if all players have voted
    /// @dev Returns false if not all players have voted
    function hasEveryoneVoted(bytes32 _gameId) public view returns (bool) {
        for (uint8 i = 0; i < games[_gameId].totalPlayers; i++) {
            if (!votes[_gameId][i].hasVoted) {
                return false;
            }
        }
        return true;
    }

    /// @notice Ensure that all players have voted
    /// @param _gameId The id of the game
    /// @dev Reverts if not all players have voted
    function ensureEveryoneVoted(bytes32 _gameId) internal view {
        bool everyoneVoted = hasEveryoneVoted(_gameId);
        if (!everyoneVoted) {
            revert NotEveryoneVoted(_gameId);
        }
    }

    /// @notice Ensure that a game exists
    /// @param _gameId The id of the game
    /// @dev Reverts if the game does not exist
    function ensureGameExists(bytes32 _gameId) internal view {
        if (games[_gameId].totalPlayers == 0) {
            revert GameNotFound(_gameId);
        }
    }

    /// @notice Ensure that a player has not voted
    /// @param _gameId The id of the game
    /// @param _player The address of the player
    /// @dev Reverts if the player has already voted
    function ensurePlayerHasNotVoted(bytes32 _gameId, address _player) internal view {
        uint8 playerIndex = getPlayerIndex(_gameId, _player);
        if (votes[_gameId][playerIndex].hasVoted) {
            revert PlayerAlreadyVoted(_gameId, _player);
        }
    }

    /// @notice End the game and determine the winner
    /// @param _gameId The id of the game
    /// @dev Emits a GameEnded event with the winner
    /// @dev Reverts if the game does not exist, not all players have voted, or the game has already ended
    function endGame(bytes32 _gameId) internal {
        if (!hasEveryoneVoted(_gameId)) {
            return;
        }
        ensureGameExists(_gameId);

        GameWithPlayers memory gameWithPlayers = getGame(_gameId);

        uint8 winnerIndex = 0;
        uint8 maxVotes = 0;

        for (uint8 i = 0; i < gameWithPlayers.game.totalPlayers; i++) {
            uint8 _votes = 0;
            for (uint8 j = 0; j < gameWithPlayers.game.totalPlayers; j++) {
                if (gameWithPlayers.players[j].vote.player == i) {
                    _votes++;
                }
            }

            if (_votes > maxVotes) {
                maxVotes = _votes;
                winnerIndex = i;
            }
        }

        address winner = gameWithPlayers.players[winnerIndex].player;
        games[_gameId].isEnded = true;
        emit GameEnded(_gameId, winner);
    }
}
