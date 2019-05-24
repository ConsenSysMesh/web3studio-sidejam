import React, { memo, useCallback } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import GameBoard from './GameBoard';
import { PublicAddress, Heading, Box, Flex, Select } from 'rimble-ui';
import JoinGameModal from './JoinGameModal';
import {
  selectAccounts,
  selectCurrentPlayerColors,
  selectIsPlayersTurn,
  selectPieces,
  selectSelectedPiece
} from './gameSelectors';
import { setPlayer, selectPiece, movePiece } from './gameReducer';

/**
 * Renders the play field that represents the board game
 *
 * @param {Object} game - Game state
 * @returns {React.Element} - Rendered element
 */
const PlayField = ({
  pieces,
  currentPlayers,
  accounts,
  isPlayersTurn,
  selectedPiece,
  onSwitchAccount,
  onPieceSelect,
  onPieceMove
}) => {
  const handlePlayerChange = useCallback(
    e => {
      onSwitchAccount(e.target.value);
    },
    [onSwitchAccount]
  );

  const handleSpaceClick = useCallback(
    (x, y, rankHash) => {
      if (rankHash) {
        onPieceSelect(rankHash);
      } else if (selectedPiece) {
        onPieceMove(selectedPiece, x, y);
      }
    },
    [selectedPiece, onPieceSelect, onPieceMove]
  );

  return (
    <Flex flexWrap="wrap" justifyContent="space-around">
      <Box width={[1, 1, 1, 7 / 12, 8 / 12]}>
        <GameBoard
          pieces={pieces}
          selectedPiece={selectedPiece}
          onSpaceClick={handleSpaceClick}
        />
      </Box>
      <Box width={[1, 1, 1, 5 / 12, 4 / 12]}>
        <Heading.h4>Players</Heading.h4>
        {currentPlayers.map(({ address, color }) => (
          <PublicAddress key={address} label={color} address={address} />
        ))}

        {accounts && accounts.length > 1 && (
          <Box width={1}>
            <Heading.h4>Switch Account</Heading.h4>
            <Select items={accounts} onChange={handlePlayerChange} />
          </Box>
        )}
        {isPlayersTurn && <Heading.h4>It's Your Turn</Heading.h4>}
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
const mapStateToProps = createStructuredSelector({
  pieces: selectPieces,
  currentPlayers: selectCurrentPlayerColors,
  accounts: selectAccounts,
  isPlayersTurn: selectIsPlayersTurn,
  selectedPiece: selectSelectedPiece
});

const mapDispatchToProps = {
  onSwitchAccount: setPlayer,
  onPieceSelect: selectPiece,
  onPieceMove: movePiece
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(PlayField));
