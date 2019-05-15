import React from 'react';
import { connect } from 'react-redux';
import GameBoard from './GameBoard';
import JoinGameModal from './JoinGameModal';
import { selectPieces } from './gameSelectors';

/**
 * Renders the play field that represents the board game
 *
 * @param {Object} game - Game state
 * @returns {React.Element} - Rendered element
 */
const PlayField = ({ pieces }) => {
  return (
    <>
      <GameBoard width={'99vw'} pieces={pieces} />
      <JoinGameModal />
    </>
  );
};
/**
 * Maps redux state to element props
 *
 * @param {Object} state - current state
 * @returns {Object} props to pass through to the component
 */
const mapStateToProps = state => ({
  pieces: selectPieces(state)
});

export default connect(mapStateToProps)(PlayField);
