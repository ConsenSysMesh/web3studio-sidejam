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

  mapping (uint => Game) public games;
  mapping (address => uint) public playerGames;

  function currentGame() public view returns(uint) {
    return playerGames[msg.sender];
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
}
