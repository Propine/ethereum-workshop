pragma solidity ^0.4.4;

contract SimpleTransfer {
  address public payer;
  address public beneficiary;
  uint public amount;
  bool ready;

  event PayInitiate(address payer, uint transacted);
  event TransferCompleted(address beneficiary, uint transacted);

  function SimpleTransfer() public {
    // constructor
    ready = false;
  }

  function pay(address receiver) public payable {
    payer = msg.sender;
    amount = msg.value;
    beneficiary = receiver;
    ready = true;
    emit PayInitiate(payer, amount);
  }

  function doTransfer() public {
    require(ready);
    beneficiary.transfer(amount);
    emit TransferCompleted(beneficiary, amount);
  }
}
