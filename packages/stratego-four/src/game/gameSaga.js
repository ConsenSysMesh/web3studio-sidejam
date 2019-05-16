import { takeLatest, takeEvery, put, select } from 'redux-saga/effects';
import { setCacheKey, setPlayer, JOIN_GAME, SET_PLAYER } from './gameReducer';
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
function* initializePlayer({ player }) {
  // get the ops after setting the player
  const ops = yield defaultTxOps();

  yield put(
    setCacheKey(
      'currentGame',
      stratego4.methods.currentGame.cacheCall(player, ops)
    )
  );

  yield put(
    setCacheKey(
      'currentPlayers',
      stratego4.methods.currentPlayers.cacheCall(player, ops)
    )
  );
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

  yield put(setPlayer(accounts[0]));
}

/**
 * A player has joined the a game
 *
 * @param {string} gameId - Game ID to join, from the action
 */
export function* joinGame({ gameId }) {
  const ops = yield defaultTxOps();
  const player = yield select(selectPlayer);
  const gameKey = web3.utils.asciiToHex(gameId);

  stratego4.methods.joinGame.cacheSend(gameKey, {
    ...ops,
    gas: 150000
  });

  // Re-initialize player to get the cache in order
  yield put(setPlayer(player));
}

/**
 * A game redux saga, performs side effects
 */
export default function* gameSaga() {
  yield takeLatest('BLOCKS_LISTENING', initializeWeb3);
  yield takeEvery('DRIZZLE_INITIALIZED', initializeGame);
  yield takeEvery(JOIN_GAME, joinGame);
  yield takeEvery(SET_PLAYER, initializePlayer);
}
