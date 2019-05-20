import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import GameBoard from './GameBoard';
import { PublicAddress, Heading, Box, Flex, Select } from 'rimble-ui';
import JoinGameModal from './JoinGameModal';
import {
  selectAccounts,
  selectCurrentPlayerColors,
  selectPieces
} from './gameSelectors';
import { setPlayer } from './gameReducer';

/**
 * Renders the play field that represents the board game
 *
 * @param {Object} game - Game state
 * @returns {React.Element} - Rendered element
 */
const PlayField = ({ pieces, currentPlayers, accounts, switchAccount }) => {
  const onPlayerChange = useCallback(
    e => {
      switchAccount(e.target.value);
    },
    [switchAccount]
  );

  return (
    <Flex flexWrap="wrap" justifyContent="space-around">
      <Box width={[1, 1, 1, 7 / 12, 8 / 12]} maxWidth={'45em'}>
        <GameBoard pieces={pieces} />
      </Box>
      <Box width={[1, 1, 1, 5 / 12, 4 / 12]}>
        <Heading.h4>Players</Heading.h4>
        {currentPlayers.map(({ address, color }) => (
          <PublicAddress key={address} label={color} address={address} />
        ))}

        {accounts && accounts.length > 1 && (
          <Box width={1}>
            <Heading.h4>Switch Account</Heading.h4>
            <Select items={accounts} onChange={onPlayerChange} />
          </Box>
        )}
      </Box>

      <JoinGameModal />
    </Flex>
  );
};
/**
 * Maps redux state to element props
 *
 * @param {Object} state - current state
 * @returns {Object} props to pass through to the component
 */
const mapStateToProps = state => ({
  pieces: selectPieces(state),
  currentPlayers: selectCurrentPlayerColors(state),
  accounts: selectAccounts(state)
});

const mapDispatchToProps = {
  switchAccount: setPlayer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayField);
