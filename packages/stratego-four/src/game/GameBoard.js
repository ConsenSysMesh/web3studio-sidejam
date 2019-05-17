import React from 'react';
import { Box } from 'rimble-ui';
import { red, yellow, green, blue, grey } from '../theme/colors';
import GamePiece from './GamePiece';
import { positions } from './defaultPieceSetup';

const rectWidth = 100;

/**
 * Render a row of svg Boxes
 *
 * @param {Object} props - element props
 * @param {number} props.width - number of rectangles wide
 * @param {number} props.xOffset - number of rectangles to offset on the x
 * @param {number} props.yOffset - number of rectangles to offset on the y
 * @param {string} props.fill - fill color for the rectangles
 *
 * @returns {React.Element} - Rendered row
 */
const Row = ({ width, xOffset, yOffset, fill }) => (
  <>
    {Array(width)
      .fill('')
      .map((value, index) => (
        <rect
          key={`rect-${xOffset}-${index}`}
          x={xOffset * rectWidth + index * rectWidth}
          y={yOffset * rectWidth}
          width={rectWidth}
          height={rectWidth}
          fill={fill}
          stroke={grey[600]}
          strokeWidth={2}
        />
      ))}
  </>
);

/**
 * Render a grid of svg Boxes
 *
 * @param {Object} props - element props
 * @param {number} props.height - number of rectangles height
 * @param {number} props.width - number of rectangles wide
 * @param {number} props.xOffset - number of rectangles to offset on the x
 * @param {number} props.yOffset - number of rectangles to offset on the y
 * @param {string} props.fill - fill color for the rectangles
 *
 * @returns {React.Element} - Rendered grid
 */
const Grid = ({ height, width, xOffset = 0, yOffset = 0, fill }) => (
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
        />
      ))}
  </>
);

const borderColor = grey[600];

export default ({ pieces, ...props }) => {
  return (
    <Box {...props}>
      <svg
        height={'100%'}
        width={'100%'}
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

        {/*Center Board*/}
        <Grid xOffset={4} yOffset={4} height={9} width={9} fill={grey[50]} />
        {/* Blue Player*/}
        <Grid xOffset={5} yOffset={1} height={3} width={7} fill={blue[100]} />
        {/* Green Player*/}
        <Grid xOffset={1} yOffset={5} height={7} width={3} fill={green[100]} />
        {/* Yellow Player*/}
        <Grid
          xOffset={13}
          yOffset={5}
          height={7}
          width={3}
          fill={yellow[100]}
        />
        {/* Red Player*/}
        <Grid xOffset={5} yOffset={13} height={3} width={7} fill={red[100]} />

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
              x={piece.x * rectWidth + 24}
              y={piece.y * rectWidth + 20}
              color={color}
            />
          ))
        )}

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
};
