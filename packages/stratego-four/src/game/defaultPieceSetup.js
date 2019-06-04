export const positions = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
  L: 12,
  M: 13,
  N: 14,
  O: 15
};

/**
 * Map alphanumerical positions to numeric for contract and components
 *
 * @param {Array<object>} positionList - List of x,y positions
 * @returns {Array<object>} a list of numeric x,y coordinates
 */
const mapToNumericalPositions = positionList =>
  positionList.map(({ x, y }) => ({ x: positions[x], y }));

export default {
  red: mapToNumericalPositions([
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
  ]),
  yellow: mapToNumericalPositions([
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
  ]),
  blue: mapToNumericalPositions([
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
  ]),
  green: mapToNumericalPositions([
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
  ])
};
