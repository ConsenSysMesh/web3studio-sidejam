pragma solidity ^0.5.0;

contract MessageReceiver {

  string public topicName;
  mapping(bytes32 => Message) public messages;
  bytes32[] public messageList;

  event MessageReceived(address msgFrom, bytes32 msgKey);

  struct Message {
    address sender;
    string message;
  }

  constructor (string memory _topicName) public {
    topicName = _topicName;
  }

  function sendMessage(bytes32 key, string memory newMessage) public {
    messageList.push(key);
    messages[key].sender = msg.sender;
    messages[key].message = newMessage;

    emit MessageReceived(msg.sender, key); 
  }

  function getMessageCount() public view returns(uint256) {
    return messageList.length;
  }

  function getMessage(bytes32 key) public view returns (address, string memory) {
    return (messages[key].sender, messages[key].message);
  }
}