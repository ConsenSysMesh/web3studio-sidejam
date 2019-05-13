const initialState = {
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
};

/**
 * Redux reducer for game state
 *
 * @param {Object} state - current state
 * @param {Object} action - Action mutating state
 * @returns {Object} new state
 */
const reducer = (state = initialState, action) => {
  return state;
};

export default reducer;
