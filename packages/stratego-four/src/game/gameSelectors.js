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

/**
 * Create a selector for a player color's pieces
 *
 * @param {string} color - The player color
 * @returns {Function} - Cache selector
 */
const selectPlayerPieces = color =>
  createSelector(
    selectGameCache,
    selectContract,
    (gameCache, contract) => {
      const pieceCacheKeys = gameCache[`getPiece-${color}`] || [];

      return pieceCacheKeys
        .map(cacheKey => contract.getPiece[cacheKey])
        .filter(cache => cache)
        .map(({ value }) => ({
          x: value[0],
          y: value[1],
          isFlagCarrier: value[2],
          rank: value[3],
          rankHash: value[4]
        }));
    }
  );

export const selectCurrentGameId = selectCacheValue('currentGame');
export const selectCurrentPlayers = selectCacheValue('currentPlayers');
export const selectIsPlayersTurn = selectCacheValue('isPlayersTurn');

export const selectRedPlayerPieces = selectPlayerPieces('red');
export const selectGreenPlayerPieces = selectPlayerPieces('green');
export const selectBluePlayerPieces = selectPlayerPieces('blue');
export const selectYellowPlayerPieces = selectPlayerPieces('yellow');

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

export const selectPieces = createSelector(
  selectRedPlayerPieces,
  selectGreenPlayerPieces,
  selectBluePlayerPieces,
  selectYellowPlayerPieces,
  (red, green, blue, yellow) => ({ red, green, blue, yellow })
);
