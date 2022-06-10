//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Messenger {
    event newMessage(string message, address sender);

    string private message;

    constructor(string memory _message) {
        console.log("Deploying a Messenger with message:", _message);
        message = _message;
    }

    function readMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string calldata _message) external {
        console.log("Changing message from '%s' to '%s'", message, _message);
        message = _message;
        emit newMessage(_message, msg.sender);
    }
}