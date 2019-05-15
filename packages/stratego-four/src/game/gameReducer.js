const initialState = {
  currentGameKey: null,
  player: null,
  pieces: {
    red: [
      { x: 'E', y: '13' },
      { x: 'F', y: '13' },
      { x: 'G', y: '13' },
      { x: 'H', y: '13' },
      { x: 'I', y: '13' },
      { x: 'J', y: '13' },
      { x: 'K', y: '13' },
      { x: 'E', y: '14' },
      { x: 'F', y: '14' },
      { x: 'G', y: '14' },
      { x: 'I', y: '14' },
      { x: 'J', y: '14' },
      { x: 'K', y: '14' },
      { x: 'E', y: '15' },
      { x: 'F', y: '15' },
      { x: 'G', y: '15' },
      { x: 'H', y: '15' },
      { x: 'I', y: '15' },
      { x: 'J', y: '15' },
      { x: 'K', y: '15' }
    ],
    yellow: [
      { x: 'M', y: '5' },
      { x: 'M', y: '6' },
      { x: 'M', y: '7' },
      { x: 'M', y: '8' },
      { x: 'M', y: '9' },
      { x: 'M', y: '10' },
      { x: 'M', y: '11' },
      { x: 'N', y: '5' },
      { x: 'N', y: '6' },
      { x: 'N', y: '7' },
      { x: 'N', y: '9' },
      { x: 'N', y: '10' },
      { x: 'N', y: '11' },
      { x: 'O', y: '5' },
      { x: 'O', y: '6' },
      { x: 'O', y: '7' },
      { x: 'O', y: '8' },
      { x: 'O', y: '9' },
      { x: 'O', y: '10' },
      { x: 'O', y: '11' }
    ],
    blue: [
      { x: 'E', y: '1' },
      { x: 'F', y: '1' },
      { x: 'G', y: '1' },
      { x: 'H', y: '1' },
      { x: 'I', y: '1' },
      { x: 'J', y: '1' },
      { x: 'K', y: '1' },
      { x: 'E', y: '2' },
      { x: 'F', y: '2' },
      { x: 'G', y: '2' },
      { x: 'I', y: '2' },
      { x: 'J', y: '2' },
      { x: 'K', y: '2' },
      { x: 'E', y: '3' },
      { x: 'F', y: '3' },
      { x: 'G', y: '3' },
      { x: 'H', y: '3' },
      { x: 'I', y: '3' },
      { x: 'J', y: '3' },
      { x: 'K', y: '3' }
    ],
    green: [
      { x: 'A', y: '5' },
      { x: 'A', y: '6' },
      { x: 'A', y: '7' },
      { x: 'A', y: '8' },
      { x: 'A', y: '9' },
      { x: 'A', y: '10' },
      { x: 'A', y: '11' },
      { x: 'B', y: '5' },
      { x: 'B', y: '6' },
      { x: 'B', y: '7' },
      { x: 'B', y: '9' },
      { x: 'B', y: '10' },
      { x: 'B', y: '11' },
      { x: 'C', y: '5' },
      { x: 'C', y: '6' },
      { x: 'C', y: '7' },
      { x: 'C', y: '8' },
      { x: 'C', y: '9' },
      { x: 'C', y: '10' },
      { x: 'C', y: '11' }
    ]
  }
};

export const JOIN_GAME = 'stratego/game/JOIN_GAME';
export const SET_PLAYER = 'stratego/game/SET_PLAYER';
export const SET_CURRENT_GAME_KEY = 'stratego/game/SET_CURRENT_GAME_KEY';

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
 * Set the current game key action generator
 *
 * @param {string} currentGameKey - Current game key hash
 * @returns {{currentGameKey: *, type: string}} Redux Action
 */
export const setCurrentGameKey = currentGameKey => ({
  type: SET_CURRENT_GAME_KEY,
  currentGameKey
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
    case SET_CURRENT_GAME_KEY: {
      return {
        ...state,
        currentGameKey: action.currentGameKey
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
