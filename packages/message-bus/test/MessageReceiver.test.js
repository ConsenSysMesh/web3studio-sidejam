const expect = require('jest-matchers');
const MessageReceiver = artifacts.require('MessageReceiver');

contract('MessageReceiver', accounts => {
  const senderAccount = accounts[0];
  const messageContent = 'The Dude abides';
  const msgKey = web3.utils.randomHex(32);
  let msgReceiver;

  it('accepts a topic name in the constructor', async () => {
    msgReceiver = await MessageReceiver.new('MyTopic');
    expect(await msgReceiver.topicName()).toEqual('MyTopic');
  });

  describe('sending a new message', async () => {
    let sendResult;

    beforeEach(async () => {
      msgReceiver = await MessageReceiver.new('MyTopic');
      sendResult = await msgReceiver.sendMessage(msgKey, messageContent, {
        from: senderAccount
      });
    });

    it('emits a message received event', async () => {
      expect(sendResult.logs[0]['event']).toEqual('MessageReceived');
    });

    it('can retrieve the message and who sent it', async () => {
      const message = await msgReceiver.getMessage(msgKey);
      expect(message[0]).toEqual(senderAccount);
      expect(message[1]).toEqual(messageContent);
    });

    it('increments the message count', async () => {
      const initialCount = await msgReceiver.getMessageCount();
      await msgReceiver.sendMessage(
        web3.utils.randomHex(32),
        'This is what happens Larry!'
      );
      const newCount = await msgReceiver.getMessageCount();
      expect(newCount - initialCount).toEqual(1);
    });
  });
});
