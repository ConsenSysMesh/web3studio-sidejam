import { takeLatest, takeEvery, put, select } from 'redux-saga/effects';
import { setCurrentGameKey, setPlayer, JOIN_GAME } from './gameReducer';
import { selectAccounts, selectPlayer } from './gameSelectors';

let web3;
let drizzle;
let stratego4;

/**
 * Get the default web3 tx options
 *
 * @returns {IterableIterator<Object>} Default Options
 */
function* defaultTxOps() {
  const player = yield select(selectPlayer);

  return {
    from: player
  };
}

/**
 * Initializes a new player into the game. Useful for start and switching
 *
 * @param {string} player - The address of the player
 */
function* initializePlayer(player) {
  yield put(setPlayer(player));

  // get the ops after setting the player
  const ops = yield defaultTxOps();

  yield put(setCurrentGameKey(stratego4.methods.currentGame.cacheCall(ops)));
}

/**
 * Stores web3 libraries for other sagas
 *
 * @param {Object} action - Drizzle action
 */
export function initializeWeb3(action) {
  web3 = action.web3;
  drizzle = action.drizzle;
  stratego4 = drizzle.contracts.Stratego4;
}

/**
 * Initialize the game state on load
 */
export function* initializeGame() {
  const accounts = yield select(selectAccounts);
  yield initializePlayer(accounts[0]);
}

/**
 * A player has joined the a game
 *
 * @param {string} gameId - Game ID to join, from the action
 */
export function* joinGame({ gameId }) {
  const ops = yield defaultTxOps();

  stratego4.methods.joinGame.cacheSend(web3.utils.asciiToHex(gameId), {
    ...ops,
    gas: 150000
  });

  // Update currentGame in the cache
  stratego4.methods.currentGame.cacheCall(ops);
}

/**
 * A game redux saga, performs side effects
 */
export default function* gameSaga() {
  yield takeEvery(JOIN_GAME, joinGame);
  yield takeLatest('BLOCKS_LISTENING', initializeWeb3);
  yield takeEvery('DRIZZLE_INITIALIZED', initializeGame);
}
