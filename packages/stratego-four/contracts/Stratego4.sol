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
    bytes32[16][16] pieceLocations;
    mapping(address => Player) players;
    uint turn;
    GameState state;
  }

  mapping (uint => Game) public games;
  mapping (address => uint) public playerGames;

  function currentGame(address player) public view returns(uint) {
    return playerGames[player];
  }

  function _currentGame(address playerAddress) internal view returns(Game storage) {
    uint gameId = currentGame(playerAddress);

    return games[gameId];
  }

  function joinGame(uint gameId) public {
    Game storage game = games[gameId];
    address playerAddress = msg.sender;

    if (game.playerAddresses.length == 0) {
      game.state = GameState.Joining;
      game.turn = 0;
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

  function currentPlayers(address playerAddress) public view returns(address[] memory) {
    Game storage game = _currentGame(playerAddress);

    return game.playerAddresses;
  }

  function playerPieces(address playerAddress) public view returns(bytes32[] memory) {
    Game storage game = _currentGame(playerAddress);

    return game.players[playerAddress].pieceRankHashes;
  }

  function isPlayersTurn(address playerAddress) public view returns(bool) {
    Game storage game = _currentGame(playerAddress);

    return game.state == GameState.InProgress && game.playerAddresses[game.turn % 4] == playerAddress;
  }

  function movePiece(address playerAddress, uint8 x, uint8 y, bytes32 rankHash) public {
    require(playerAddress == msg.sender, "You can only move your piece");

    Game storage game = _currentGame(playerAddress);
    Piece storage piece = game.players[playerAddress].pieces[rankHash];

    // Eventually add attack logic here
    require(game.pieceLocations[x][y] == "", "Piece location must be empty");

    if (game.state == GameState.InProgress) {
      require(isPlayersTurn(playerAddress), "You can only move during your turn");
      game.turn += 1;
    }

    // Clear old position
    game.pieceLocations[piece.x][piece.y] = "";

    // Set new position;
    game.pieceLocations[x][y] = rankHash;
    piece.x = x;
    piece.y = y;
  }

  function addPiece(address playerAddress, uint8 x, uint8 y, bytes32 rankHash, bool isFlagCarrier) public {
    require(playerAddress == msg.sender, "You can only add your own piece");

    uint gameId = currentGame(playerAddress);
    Game storage game = _currentGame(playerAddress);
    Player storage player = game.players[playerAddress];
    Piece memory piece;

    require(player.pieceRankHashes.length < 20, "All pieces have already been added");
    require(player.hasJoined == true, "Not in this game");

    piece.isFlagCarrier = isFlagCarrier;
    player.pieceRankHashes.push(rankHash);
    player.pieces[rankHash] = piece;

    movePiece(playerAddress, x, y, rankHash);

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

  function getPiece(address playerAddress, bytes32 rankHash) public view returns(uint8, uint8, bool, uint8, bytes32) {
    Game storage game = _currentGame(playerAddress);
    Player storage player = game.players[playerAddress];
    Piece storage piece = player.pieces[rankHash];

    return (piece.x, piece.y, piece.isFlagCarrier, piece.rank, rankHash);
  }
}
