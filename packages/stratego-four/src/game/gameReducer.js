export const JOIN_GAME = 'stratego/game/JOIN_GAME';
export const SET_PLAYER = 'stratego/game/SET_PLAYER';
export const MOVE_PIECE = 'stratego/game/MOVE_PIECE';
export const SELECT_PIECE = 'stratego/game/SELECT_PIECE';
export const SET_CACHE_KEY = 'stratego/game/SET_CACHE_KEY';

/**
 * Join a Game action generator
 *
 * @param {string} gameId - A game ID
 * @returns {{gameId: *, type: string}} Redux Action
 */
export const joinGame = gameId => ({
  type: JOIN_GAME,
  gameId
});

/**
 * Set the current cache key action generator
 *
 * @param {string} key - key name
 * @param {string} value - cache key
 * @returns {Object} Redux Action
 */
export const setCacheKey = (key, value) => ({
  type: SET_CACHE_KEY,
  key,
  value
});

/**
 * Set the current player
 *
 * @param {string} player - player address
 * @returns {{type: string, player: *}} Redux Action
 */
export const setPlayer = player => ({
  type: SET_PLAYER,
  player
});

/**
 * Set the current player
 *
 * @param {string} rankHash - piece rank hash
 * @param {number} x - x position
 * @param {number} y - y position
 * @returns {{type: string, player: *}} Redux Action
 */
export const movePiece = (rankHash, x, y) => ({
  type: MOVE_PIECE,
  rankHash,
  x,
  y
});

/**
 * Set the current player
 *
 * @param {string} rankHash - piece rank hash
 * @returns {{type: string, player: *}} Redux Action
 */
export const selectPiece = rankHash => ({
  type: SELECT_PIECE,
  rankHash
});

const initialState = {
  cache: null,
  player: null,
  selectedPiece: null
};

/**
 * Redux reducer for game state
 *
 * @param {Object} state - current state
 * @param {Object} action - Action mutating state
 * @returns {Object} new state
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CACHE_KEY: {
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.key]: action.value
        }
      };
    }

    case SET_PLAYER: {
      return {
        ...state,
        cache: null,
        player: action.player
      };
    }

    case SELECT_PIECE: {
      return {
        ...state,
        selectedPiece: action.rankHash
      };
    }

    default:
      return state;
  }
};

export default reducer;
