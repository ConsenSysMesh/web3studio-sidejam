import React, { memo } from 'react';
import * as colors from '../theme/colors';

/**
 * A Game Piece Component
 *
 * @param {object} props - props
 * @param {string} props.color - Color of the piece
 * @param {boolean} props.isSelected - is the piece selected?
 * @param {...Array} props.props - The rest of the props
 * @returns {React.Element} - A lovely element
 */
const GamePiece = ({ color, isSelected, ...props }) => {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" {...props}>
      {/* Fill opacity used to make the whole space clickable*/}
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill={colors[color][100]}
        fillOpacity={isSelected ? 0.5 : 0}
        stroke={colors[color][500]}
        strokeWidth={isSelected ? 10 : 0}
      />
      <g transform="translate(24 20)">
        <rect x="7" y="5" width="38" height="52" fill={colors[color][600]} />
        <rect x="11" width="12" height="5" fill={colors[color][600]} />
        <rect x="29" width="12" height="5" fill={colors[color][600]} />
        <rect x="2" width="5" height="57" fill={colors.grey[700]} />
        <rect x="45" width="5" height="57" fill={colors.grey[700]} />
        <path d="M2 57H50L52 61H0L2 57Z" fill={colors.grey[700]} />
      </g>
    </svg>
  );
};

export default memo(GamePiece);
