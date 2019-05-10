pragma solidity ^0.5.0;

contract Stratego4 {
  enum GameState { Joining, AddingPieces, InProgress, Finished }

  struct Piece {
    uint8 x;
    uint8 y;
    uint8 rank;
    bool isFlagCarrier;
  }

  struct Player {
    address player;
    uint256[] pieceRankHashes;
    mapping(uint256 => Piece) pieces;
    bool hasJoined;
  }

  struct Game {
    address[] playerAddresses;
    mapping(address => Player) players;
    GameState state;
  }

  mapping (uint => Game) games;

  function newGame(uint gameId) public {
    Game storage game = games[gameId];
    require(game.playerAddresses.length == 0, 'Game already exists');

    game.state = GameState.Joining;
    joinGame(gameId);
  }

  function joinGame(uint gameId) public {
    Game storage game = games[gameId];
    address playerAddress = msg.sender;

    require(game.state == GameState.Joining, 'Game Already Full');

    game.playerAddresses.push(playerAddress);
    game.players[playerAddress].hasJoined = true;

    if (game.playerAddresses.length == 4) {
      game.state = GameState.AddingPieces;
    }
  }

  function addPiece(uint gameId, uint8 x, uint8 y, uint256 rankHash, bool isFlagCarrier) public {
    Game storage game = games[gameId];
    address playerAddress = msg.sender;
    Player storage player = game.players[playerAddress];
    Piece storage piece = player.pieces[rankHash];

    require(game.state == GameState.AddingPieces, 'All pieces have already been added');
    require(player.hasJoined == true, 'Not in this game');

    piece.x = x;
    piece.y = y;
    piece.isFlagCarrier = isFlagCarrier;

    player.pieceRankHashes.push(rankHash);
    player.pieces[rankHash] = piece;

    if (
      _playerPieceCount(gameId, 0) == 20 &&
      _playerPieceCount(gameId, 1) == 20 &&
      _playerPieceCount(gameId, 2) == 20 &&
      _playerPieceCount(gameId, 3) == 20
    ) {

      game.state = GameState.InProgress;
    }
  }

  function _playerPieceCount(uint gameId, uint8 playerIndex) private view returns(uint){
    Game storage game = games[gameId];

    return game.players[game.playerAddresses[playerIndex]].pieceRankHashes.length;
  }
}
