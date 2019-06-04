const expect = require('jest-matchers');
const Stratego4 = artifacts.require('Stratego4');

contract('Stratego4', accounts => {
  /**
   * Generate the rankHash for a Piece - currently just random
   *
   * @returns {string} - rank hash
   */
  const generateRankHash = () => web3.utils.sha3(web3.utils.randomHex(16));

  const player1 = accounts[0]; // Ready?
  const x = 5;
  const y = 13;
  const isFlagCarrier = false;
  const rankHash = generateRankHash();

  let contract;

  /**
   * Expect the result of getting a particular piece
   *
   * @param {string} player - Player address
   * @param {string} rankHash - rank hash of player's piece
   * @param {object} expected - expected result of the piece
   */
  const expectPiece = async (player, rankHash, expected) => {
    const piece = await contract.getPiece(player, rankHash);

    expect(piece[0].toNumber()).toEqual(expected.x);
    expect(piece[1].toNumber()).toEqual(expected.y);
    expect(piece[2]).toEqual(expected.isFlagCarrier);
    expect(piece[3].toNumber()).toEqual(expected.rank);
    expect(piece[4]).toEqual(expected.rankHash);
  };

  beforeEach(async () => {
    contract = await Stratego4.new();
    await contract.joinGame(1);
    await contract.addPiece(player1, x, y, rankHash, isFlagCarrier);
  });

  it('can join a game', async () => {
    expect(await contract.currentPlayers(player1)).toEqual([player1]);
  });

  it('can add a piece a game', async () => {
    await expectPiece(player1, rankHash, {
      x,
      y,
      isFlagCarrier,
      rank: 0,
      rankHash
    });
  });

  it('can move a piece', async () => {
    const newX = x + 1;
    const newY = y - 1;

    await contract.movePiece(player1, newX, newY, rankHash);

    await expectPiece(player1, rankHash, {
      x: newX,
      y: newY,
      isFlagCarrier,
      rank: 0,
      rankHash
    });
  });
});
