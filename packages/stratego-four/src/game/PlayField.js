import React from 'react';
import { connect } from 'react-redux';
import GameBoard from './GameBoard';
import JoinGameModal from './JoinGameModal';

/**
 * Renders the play field that represents the board game
 *
 * @param {Object} game - Game state
 * @returns {React.Element} - Rendered element
 */
const PlayField = ({ game }) => {
  return (
    <>
      <GameBoard width={'99vw'} game={game} />
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
  game: state.game
});

export default connect(mapStateToProps)(PlayField);
