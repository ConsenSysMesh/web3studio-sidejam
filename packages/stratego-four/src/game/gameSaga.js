import { takeLatest, takeEvery, put, select } from 'redux-saga/effects';
import { setCacheKey, setPlayer, JOIN_GAME, SET_PLAYER } from './gameReducer';
import {
  selectAccounts,
  selectPlayerColor,
  selectPlayer,
  selectCurrentPlayerColors,
  selectGameCache
} from './gameSelectors';
import defaultPieceSetup from './defaultPieceSetup';

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
 * Initialize player pieces with default values
 */
export function* initializePlayerPieces() {
  const ops = yield defaultTxOps();
  const player = yield select(selectPlayer);
  const playerColor = yield select(selectPlayerColor);

  defaultPieceSetup[playerColor].forEach(piece => {
    // Using random bits, this will eventually be a salt
    const rankHash = web3.utils.sha3(web3.utils.randomHex(16));

    stratego4.methods.addPiece.cacheSend(
      player,
      piece.x,
      piece.y,
      rankHash,
      false,
      { ...ops, gas: 200000 }
    );
  });
}

/**
 * Update the piece cache for a player
 *
 * @param {Array<string>} pieces - Array of piece rank hashes
 * @param {string} playerAddress - Address of player to update
 */
export function* updatePieceCache(pieces, playerAddress) {
  const ops = yield defaultTxOps();
  const playerColors = yield select(selectCurrentPlayerColors);
  const gameCache = yield select(selectGameCache);
  const player = playerColors.find(player => player.address === playerAddress);

  if (!player) {
    // Skip if a player isn't found. Happens when changing to a new game
    return;
  }

  const gameCacheKey = `getPiece-${player.color}`;
  const currentPieceCache = gameCache[gameCacheKey] || [];

  yield put(
    setCacheKey(
      gameCacheKey,
      pieces.map(piece => {
        const args = [playerAddress, piece, ops];
        const cacheKey = stratego4.generateArgsHash(args);

        if (!currentPieceCache.includes(cacheKey)) {
          stratego4.methods.getPiece.cacheCall(playerAddress, piece, ops);
        }

        return cacheKey;
      })
    )
  );
}

/**
 * Handle when drizzle receives player piece rank hashes
 *
 * @param {Object} action - redux action
 */
export function* handleGotPlayerPieces(action) {
  const player = yield select(selectPlayer);
  const actionPlayer = action.args[0];
  const playerColor = yield select(selectPlayerColor);
  const pieces = action.value;
  const isAlreadySetup = pieces.length > 0;

  const isCurrentPlayer = actionPlayer === player;

  if (!playerColor) {
    return;
  }

  if (isCurrentPlayer && !isAlreadySetup) {
    yield initializePlayerPieces();
  }

  yield updatePieceCache(pieces, actionPlayer);
}

/**
 * Handle when drizzle receives current player addresses
 *
 * @param {Object} action - Redux action
 */
export function* handleGotCurrentPlayers(action) {
  const ops = yield defaultTxOps();
  const currentPlayers = action.value;

  currentPlayers.forEach(player =>
    stratego4.methods.playerPieces.cacheCall(player, ops)
  );
}

/**
 * Handles when drizzle receives contract events, switches to fn handlers
 *
 * @param {Object} action - Redux action
 */
export function* handleGotContractVar(action) {
  switch (action.variable) {
    case 'playerPieces':
      yield handleGotPlayerPieces(action);
      break;

    case 'currentPlayers':
      yield handleGotCurrentPlayers(action);
      break;

    default:
      break;
  }
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
  // Hooking into Drizzle Events
  yield takeLatest('BLOCKS_LISTENING', initializeWeb3);
  yield takeEvery('DRIZZLE_INITIALIZED', initializeGame);
  yield takeEvery('GOT_CONTRACT_VAR', handleGotContractVar);

  // Our events
  yield takeEvery(SET_PLAYER, initializePlayer);
  yield takeEvery(JOIN_GAME, joinGame);
  yield takeEvery(SET_PLAYER, initializePlayer);
}
