import React, { memo } from 'react';
import { Box } from 'rimble-ui';
import { red, yellow, green, blue, grey } from '../theme/colors';
import GamePiece from './GamePiece';
import { positions } from './defaultPieceSetup';

const rectWidth = 100;

/**
 * Render a row of svg Boxes
 *
 * @param {object} props - element props
 * @param {number} props.width - number of rectangles wide
 * @param {number} props.xOffset - number of rectangles to offset on the x
 * @param {number} props.yOffset - number of rectangles to offset on the y
 * @param {string} props.fill - fill color for the rectangles
 *
 * @returns {React.Element} - Rendered row
 */
const Row = ({ width, xOffset, yOffset, fill, onSpaceClick }) => (
  <>
    {Array(width)
      .fill('')
      .map((value, index) => {
        const x = xOffset + index;
        const y = yOffset;

        return (
          <rect
            onClick={onSpaceClick(x, y)}
            key={`rect-${xOffset}-${index}`}
            x={x * rectWidth}
            y={y * rectWidth}
            width={rectWidth}
            height={rectWidth}
            fill={fill}
            stroke={grey[600]}
            strokeWidth={2}
          />
        );
      })}
  </>
);

/**
 * Render a grid of svg Boxes
 *
 * @param {object} props - element props
 * @param {number} props.height - number of rectangles height
 * @param {number} props.width - number of rectangles wide
 * @param {number} props.xOffset - number of rectangles to offset on the x
 * @param {number} props.yOffset - number of rectangles to offset on the y
 * @param {string} props.fill - fill color for the rectangles
 *
 * @returns {React.Element} - Rendered grid
 */
const Grid = ({
  height,
  width,
  xOffset = 0,
  yOffset = 0,
  fill,
  onSpaceClick
}) => (
  <>
    {Array(height)
      .fill('')
      .map((value, index) => (
        <Row
          key={`grid-${xOffset}-${yOffset}-${index}`}
          width={width}
          xOffset={xOffset}
          yOffset={yOffset + index}
          fill={fill}
          onSpaceClick={onSpaceClick}
        />
      ))}
  </>
);

const borderColor = grey[600];

const boardConfig = [
  { x: 4, y: 4, height: 9, width: 9, fill: grey[50] }, // Center
  { x: 5, y: 13, height: 3, width: 7, fill: red[100] }, // Red
  { x: 5, y: 1, height: 3, width: 7, fill: blue[100] }, // Blue
  { x: 1, y: 5, height: 7, width: 3, fill: green[100] }, // Green
  { x: 13, y: 5, height: 7, width: 3, fill: yellow[100] } // Yellow
];

export default memo(({ pieces, selectedPiece, onSpaceClick, ...props }) => {
  /**
   * Handler generator for when a space is clicked
   *
   * @param {Array} params - parameters to pass
   * @returns {Function} - the actual handler
   */
  const handleSpaceClick = (...params) => () => onSpaceClick(...params);

  return (
    <Box {...props}>
      <svg
        height={'100%'}
        width={'100%'}
        style={{ maxHeight: '100vh' }}
        viewBox="0 0 1700 1700"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
        .header { 
          font: bold 30px 'Source Sans Pro'; 
          fill: ${grey[800]};
        }
        `}</style>

        {boardConfig.map(grid => (
          <Grid
            key={grid.x + '-' + grid.y}
            xOffset={grid.x}
            yOffset={grid.y}
            height={grid.height}
            width={grid.width}
            fill={grid.fill}
            onSpaceClick={handleSpaceClick}
          />
        ))}

        <circle
          cx="850"
          cy="850"
          r="150"
          fill={grey[100]}
          stroke={borderColor}
          strokeWidth="3"
        />

        <circle
          cx="850"
          cy="850"
          r="50"
          fill={grey[200]}
          stroke={borderColor}
          strokeWidth="3"
        />

        {Object.entries(pieces).map(([color, player]) =>
          player.map(piece => (
            <GamePiece
              key={`${color}-{${piece.x},${piece.y}}`}
              isSelected={piece.rankHash === selectedPiece}
              x={piece.x * rectWidth}
              y={piece.y * rectWidth}
              color={color}
              onClick={handleSpaceClick(piece.x, piece.y, piece.rankHash)}
            />
          ))
        )}

        {/* Board Space numberings */}
        {Object.entries(positions).map(([label, pos]) => {
          const offset = (pos - 1) * rectWidth + rectWidth * 1.5;
          const fixed = 40;

          return (
            <React.Fragment key={`label-${label}-${pos}`}>
              <text
                x={fixed}
                y={offset}
                textAnchor="middle"
                dominantBaseline="middle"
                className={'header'}
              >
                {pos}
              </text>

              <text
                y={fixed}
                x={offset}
                textAnchor="middle"
                dominantBaseline="middle"
                className={'header'}
              >
                {label}
              </text>
            </React.Fragment>
          );
        })}
      </svg>
    </Box>
  );
});
