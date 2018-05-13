pragma solidity ^0.4.4;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract MyToken is MintableToken {

  string public constant name = "My Own Token";
  string public constant symbol = "MOT";
  uint8 public constant decimals = 18;

}
