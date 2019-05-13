import React, { useState, useCallback } from 'react';
import { Modal, Heading, Card, Form, Button } from 'rimble-ui';
import { drizzleReactHooks } from 'drizzle-react';

/**
 * Renders a modal to join a specific game
 *
 * @returns {React.Element} - Rendered element
 */
const JoinGameModal = () => {
  const [gameIdValue, setGameIdValue] = useState('');
  const {
    drizzle: { web3 },
    useCacheSend,
    useCacheCall
  } = drizzleReactHooks.useDrizzle();
  const { send } = useCacheSend('Stratego4', 'joinGame');

  const gameId = useCacheCall('Stratego4', 'currentGame');
  const modelOpen = gameId === '0';

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      send(web3.utils.asciiToHex(gameIdValue));
    },
    [send, web3, gameIdValue]
  );

  const updateGameIdValue = useCallback(
    event => {
      setGameIdValue(event.target.value);
    },
    [setGameIdValue]
  );

  return (
    <Modal isOpen={modelOpen}>
      <Card width={[1, 1 / 2]}>
        <Form onSubmit={handleSubmit}>
          <Heading.h3>Enter a Game</Heading.h3>
          <Form.Field label="Game ID">
            <Form.Input
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

export default JoinGameModal;
