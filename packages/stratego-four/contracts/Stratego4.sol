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
    bytes32[] pieceRankHashes;
    mapping(bytes32 => Piece) pieces;
    bool hasJoined;
  }

  struct Game {
    address[] playerAddresses;
    mapping(address => Player) players;
    GameState state;
  }

  mapping (uint => Game) public games;
  mapping (address => uint) public playerGames;

  function currentGame(address player) public view returns(uint) {
    return playerGames[player];
  }

  function joinGame(uint gameId) public {
    Game storage game = games[gameId];
    address playerAddress = msg.sender;

    if (game.playerAddresses.length == 0) {
      game.state = GameState.Joining;
    }

    require(!game.players[playerAddress].hasJoined, "Already joined game");
    require(game.state == GameState.Joining, "Game Already Full");

    game.playerAddresses.push(playerAddress);
    game.players[playerAddress].hasJoined = true;
    playerGames[playerAddress] = gameId;

    if (game.playerAddresses.length == 4) {
      game.state = GameState.AddingPieces;
    }
  }

  function currentPlayers(address player) public view returns(address[] memory) {
    uint gameId = currentGame(player);

    return games[gameId].playerAddresses;
  }

  function playerPieces(address player) public view returns(bytes32[] memory) {
    uint gameId = currentGame(player);

    return games[gameId].players[player].pieceRankHashes;
  }

  function addPiece(address playerAddress, uint8 x, uint8 y, bytes32 rankHash, bool isFlagCarrier) public {
    uint gameId = currentGame(playerAddress);
    Game storage game = games[gameId];
    Player storage player = game.players[playerAddress];
    Piece memory piece;

    require(player.pieceRankHashes.length < 20, "All pieces have already been added");
    require(player.hasJoined == true, "Not in this game");

    piece.x = x;
    piece.y = y;
    piece.isFlagCarrier = isFlagCarrier;

    player.pieceRankHashes.push(rankHash);
    player.pieces[rankHash] = piece;

    if (
      game.playerAddresses.length == 4 &&
      _playerPieceCount(gameId, 0) == 20 &&
      _playerPieceCount(gameId, 1) == 20 &&
      _playerPieceCount(gameId, 2) == 20 &&
      _playerPieceCount(gameId, 3) == 20
    ) {
      game.state = GameState.InProgress;
    }
  }

  function _playerPieceCount(uint gameId, uint8 playerIndex) private view returns(uint) {
    Game storage game = games[gameId];

    return game.players[game.playerAddresses[playerIndex]].pieceRankHashes.length;
  }

  function getPiece(address playerAddress, bytes32 rankHash) public view returns(uint8, uint8, bool, uint8) {
    uint gameId = currentGame(playerAddress);
    Game storage game = games[gameId];
    Player storage player = game.players[playerAddress];
    Piece storage piece = player.pieces[rankHash];

    return (piece.x, piece.y, piece.isFlagCarrier, piece.rank);
  }
}
