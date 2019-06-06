import { takeLatest, takeEvery, put, select } from 'redux-saga/effects';
import {
  setCacheKey,
  setPlayer,
  JOIN_GAME,
  SET_PLAYER,
  MOVE_PIECE
} from './gameReducer';
import {
  selectAccounts,
  selectPlayerColor,
  selectPlayer,
  selectPieces
} from './gameSelectors';
import defaultPieceSetup from './defaultPieceSetup';

let web3;
let drizzle;
let stratego4;

/**
 * Get the default web3 tx options
 *
 * @returns {IterableIterator<object>} Default Options
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
      stratego4.methods.currentGame.cacheCall(player, { ...ops })
    )
  );

  yield put(
    setCacheKey(
      'currentPlayers',
      stratego4.methods.currentPlayers.cacheCall(player, { ...ops })
    )
  );

  yield put(
    setCacheKey(
      'isPlayersTurn',
      stratego4.methods.isPlayersTurn.cacheCall(player, { ...ops })
    )
  );

  yield put(
    setCacheKey(
      'getGamePieces',
      stratego4.methods.getGamePieces.cacheCall(player, { ...ops })
    )
  );
}

/**
 * Stores web3 libraries for other sagas
 *
 * @param {object} action - Drizzle action
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
 * Handle when drizzle receives player piece rank hashes
 *
 * @param {object} action - redux action
 */
export function* handleGotGamePieces(action) {
  const player = yield select(selectPlayer);
  const actionPlayer = action.args[0];
  const playerColor = yield select(selectPlayerColor);
  const gamePieces = yield select(selectPieces);

  const isCurrentPlayer = actionPlayer === player;

  if (!playerColor) {
    return;
  }

  const pieces = gamePieces[playerColor];
  const isAlreadySetup = pieces.length > 0;

  if (isCurrentPlayer && !isAlreadySetup) {
    yield initializePlayerPieces();
  }
}

/**
 * Handles when drizzle receives contract events, switches to fn handlers
 *
 * @param {object} action - Redux action
 */
export function* handleGotContractVar(action) {
  switch (action.variable) {
    case 'getGamePieces':
      yield handleGotGamePieces(action);
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
  const gameKey = web3.utils.asciiToHex(gameId);

  stratego4.methods.joinGame.cacheSend(gameKey, {
    ...ops,
    gas: 150000
  });
}

/**
 * A player has joined the a game
 *
 * @param {string} gameId - Game ID to join, from the action
 */
export function* movePiece({ x, y, rankHash }) {
  const ops = yield defaultTxOps();
  const player = yield select(selectPlayer);

  stratego4.methods.movePiece.cacheSend(player, x, y, rankHash, {
    ...ops,
    gas: 150000
  });
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
  yield takeEvery(MOVE_PIECE, movePiece);
}
