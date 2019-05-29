import { createSelector } from 'reselect';

/**
 * Select the Game object from state
 *
 * @param {Object} state - Redux state
 * @returns {Object} the game
 */
export const selectGame = state => state.game;

/**
 * Select the Stratego contract from state
 *
 * @param {Object} state - Redux state
 * @returns {Object} stratego contract
 */
export const selectContract = state => state.contracts.Stratego4;

/**
 * Select the web3 accounts from state
 *
 * @param {Object} state - Redux state
 * @returns {Object} provider accounts
 */
export const selectAccounts = state =>
  Object.entries(state.accounts || []).map(([label, address]) => address);

export const selectPlayer = createSelector(
  selectGame,
  game => game.player
);

export const selectGameCache = createSelector(
  selectGame,
  game => game.cache || {}
);

export const selectSelectedPiece = createSelector(
  selectGame,
  game => game.selectedPiece
);
/**
 * Create a selector for a cached function
 *
 * @param {string} key - The name of the cached function
 * @returns {Function} - Cache selector
 */
const selectCacheValue = key =>
  createSelector(
    selectGameCache,
    selectContract,
    (gameCache, contract) => {
      const cachedValue = contract[key][gameCache[key]];

      return cachedValue && cachedValue.value;
    }
  );

export const selectCurrentGameId = selectCacheValue('currentGame');
export const selectCurrentPlayers = selectCacheValue('currentPlayers');
export const selectIsPlayersTurn = selectCacheValue('isPlayersTurn');
export const selectGamePieces = selectCacheValue('getGamePieces');

const playerColors = new Map([
  [-1, ''],
  [0, 'red'],
  [1, 'green'],
  [2, 'blue'],
  [3, 'yellow']
]);

export const selectCurrentPlayerColors = createSelector(
  selectPlayer,
  selectCurrentPlayers,
  (player, players = []) => {
    return players.map((address, index) => ({
      address,
      color: playerColors.get(index)
    }));
  }
);

export const selectPlayerColor = createSelector(
  selectPlayer,
  selectCurrentPlayerColors,
  (playerAddress, players) =>
    (players.find(player => player.address === playerAddress) || {}).color
);

/**
 * Create an initial empty board state
 *
 * @returns {Object} An Empty board
 */
const initialBoard = () => ({
  red: [],
  green: [],
  blue: [],
  yellow: []
});

export const selectPieces = createSelector(
  selectGamePieces,
  selectCurrentPlayerColors,
  (gamePieces, playerColors) => {
    if (!gamePieces) {
      return initialBoard();
    }

    return gamePieces[0]
      .map((x, index) => ({
        x: gamePieces[0][index],
        y: gamePieces[1][index],
        isFlagCarrier: gamePieces[2][index],
        rank: gamePieces[3][index],
        rankHash: gamePieces[4][index],
        player: gamePieces[5][index]
      }))
      .filter(piece => piece.x !== '0')
      .reduce((board, piece) => {
        const color = (
          playerColors.find(player => player.address === piece.player) || {}
        ).color;

        if (color) {
          board[color].push(piece);
        }

        return board;
      }, initialBoard());
  }
);
