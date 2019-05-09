import React from 'react';
import { Box } from 'rimble-ui';
import { red, yellow, green, blue, grey } from '../theme/colors';
import GamePiece from './GamePiece';

const rectWidth = 100;

const Row = ({ width, xOffset, yOffset, fill }) => (
  <>
    {Array(width)
      .fill('')
      .map((value, index) => (
        <rect
          x={xOffset * rectWidth + index * rectWidth}
          y={yOffset * rectWidth}
          width={rectWidth}
          height={rectWidth}
          fill={fill}
          stroke="black"
        />
      ))}
  </>
);

const Grid = ({ height, width, xOffset = 0, yOffset = 0, fill }) => (
  <>
    {Array(height)
      .fill('')
      .map((value, index) => (
        <Row
          width={width}
          xOffset={xOffset}
          yOffset={yOffset + index}
          fill={fill}
        />
      ))}
  </>
);

const positions = {
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

export default ({ game, ...props }) => {
  return (
    <Box {...props}>
      <svg
        height={'100%'}
        width={'100%'}
        viewBox="0 0 1600 1600"
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
          stroke="black"
          strokeWidth="2"
        />

        <circle
          cx="850"
          cy="850"
          r="51.5"
          fill={grey[200]}
          stroke="black"
          strokeWidth="3"
        />

        {Object.entries(game).map(([color, pieces]) =>
          pieces.map(piece => (
            <GamePiece
              x={positions[piece.x] * rectWidth + 24}
              y={piece.y * rectWidth + 20}
              color={color}
            />
          ))
        )}

        {Object.entries(positions).map(([label, pos]) => {
          const offset = (pos - 1) * rectWidth + rectWidth * 1.5;
          const fixed = 40;

          return (
            <>
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
            </>
          );
        })}
      </svg>
    </Box>
  );
};
