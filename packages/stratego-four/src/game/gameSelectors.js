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

export const selectPieces = createSelector(
  selectGame,
  game => game.pieces
);

export const selectPlayer = createSelector(
  selectGame,
  game => game.player
);

/**
 * Create a selector for a cached function
 *
 * @param {string} key - The name of the cached function
 * @returns {OutputSelector} - Cache selector
 */
const selectCacheValue = key =>
  createSelector(
    selectGame,
    selectContract,
    (game, contract) => {
      const cachedValue = contract[key][game.cache[key]];

      return cachedValue && cachedValue.value;
    }
  );

export const selectCurrentGameId = selectCacheValue('currentGame');
export const selectCurrentPlayers = selectCacheValue('currentPlayers');

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
