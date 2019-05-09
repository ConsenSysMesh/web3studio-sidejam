import React from 'react';
import { Box } from 'rimble-ui';
import { red, yellow, green, blue, grey } from '../theme/colors';

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

export default props => {
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

        {Array(15)
          .fill('')
          .map((value, index) => (
            <text
              x={20}
              y={index * 100 + 150}
              text-anchor="middle"
              dominant-baseline="middle"
              className={'header'}
            >
              {index + 1}
            </text>
          ))}

        {[
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O'
        ].map((value, index) => (
          <text
            y={40}
            x={index * 100 + 150}
            text-anchor="middle"
            dominant-baseline="middle"
            className={'header'}
          >
            {value}
          </text>
        ))}
      </svg>
    </Box>
  );
};
