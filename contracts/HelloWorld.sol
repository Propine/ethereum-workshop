pragma solidity ^0.4.4;

contract HelloWorld {
  function HelloWorld() {
    // constructor
  }
  
  string private message;
 
  function getMessage () constant returns (string) {
    return message;
  }
  function setMessage(string newMessage) {
    message = newMessage;
  }
}
