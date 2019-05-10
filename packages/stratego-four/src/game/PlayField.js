import React from 'react';
import GameBoard from './GameBoard';
import { connect } from 'react-redux';

const PlayField = ({ game }) => <GameBoard width={'99vw'} game={game} />;

const mapStateToProps = state => ({
  game: state.game
});

export default connect(mapStateToProps)(PlayField);
