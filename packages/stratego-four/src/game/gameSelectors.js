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
export const selectAccounts = state => state.accounts;

export const selectPieces = createSelector(
  selectGame,
  game => game.pieces
);

export const selectPlayer = createSelector(
  selectGame,
  game => game.player
);

export const selectCurrentGameId = createSelector(
  selectGame,
  selectContract,
  (game, contract) => {
    return contract.currentGame[game.currentGameKey].value;
  }
);
