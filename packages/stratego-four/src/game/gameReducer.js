const initialState = {
  cache: null,
  player: null,
  pieces: {
    red: [],
    yellow: [],
    blue: [],
    green: []
  }
};

export const JOIN_GAME = 'stratego/game/JOIN_GAME';
export const SET_PLAYER = 'stratego/game/SET_PLAYER';
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
        player: action.player
      };
    }

    default:
      return state;
  }
};

export default reducer;
