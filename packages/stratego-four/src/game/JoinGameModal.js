import React, { useState, useCallback } from 'react';
import { Modal, Heading, Card, Form, Button } from 'rimble-ui';
import { connect } from 'react-redux';
import { selectCurrentGameId } from './gameSelectors';
import { joinGame } from './gameReducer';

/**
 * Renders a modal to join a specific game
 *
 * @param {object} props - React props
 * @param {boolean} props.modalOpen - should the modal be open?
 * @param {Function} props.joinGame - Join Game action
 * @returns {React.Component} - A React Component
 */
const JoinGameModal = ({ modalOpen, joinGame }) => {
  const [gameIdValue, setGameIdValue] = useState('');
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      joinGame(gameIdValue);
    },
    [gameIdValue, joinGame]
  );

  const updateGameIdValue = useCallback(
    event => {
      setGameIdValue(event.target.value);
    },
    [setGameIdValue]
  );

  return (
    <Modal isOpen={modalOpen}>
      <Card width={[1, 1 / 2]}>
        <Form onSubmit={handleSubmit}>
          <Heading.h3>Enter a Game</Heading.h3>
          <Form.Field label="Game ID">
            <Form.Input
              autoFocus={true}
              type="text"
              required={true}
              onChange={updateGameIdValue}
            />
          </Form.Field>
          <Button type="submit">Create or Join</Button>
        </Form>
      </Card>
    </Modal>
  );
};

/**
 * Maps redux state to React properties
 *
 * @param {object} state - Redux State
 * @returns {object} Properties applied to the element
 */
const mapStateToProps = state => {
  const gameId = selectCurrentGameId(state);
  return {
    modalOpen: gameId === '0'
  };
};

const mapDispatchToProps = {
  joinGame
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinGameModal);
