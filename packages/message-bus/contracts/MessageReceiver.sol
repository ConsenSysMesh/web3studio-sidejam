pragma solidity ^0.5.0;

contract MessageReceiver {

  // Each receiver manages messages for only one topic
  string public topicName;
  // Message key to message mapping for look-up
  mapping(bytes32 => Message) public messages;
  // Message key stored in an array for ordering/indexing
  bytes32[] public messageList;

  // Event to notify listening/interested parties
  event MessageReceived(string topicName, address msgFrom, bytes32 msgKey);

  struct Message {
    address sender;
    string message;
  }

  /**
  * @notice Create a new MessageReceiver for a specific topic
  *
  * @param topic string The topic name for the messages
  */
  constructor (string memory topic) public {
    topicName = topic;
  }

  /**
  * @notice Send a new message to the "bus". Emits a MessageReceived event.
  *
  * @param key bytes32 The key for your message, should be unique
  * @param newMessage string The message contents
  */
  function sendMessage(bytes32 key, string memory newMessage) public {
    messageList.push(key);
    messages[key].sender = msg.sender;
    messages[key].message = newMessage;

    emit MessageReceived(topicName, msg.sender, key); 
  }

  /**
  * @notice Gets the count of the messages sent to this topic
  * 
  * @return uint256 Count of messages
  */
  function getMessageCount() public view returns(uint256) {
    return messageList.length;
  }

  /**
  * @notice Gets a message given a key
  *
  * @return address, string Returns the sender address and message contents 
  */
  function getMessage(bytes32 key) public view returns (address, string memory) {
    return (messages[key].sender, messages[key].message);
  }
}