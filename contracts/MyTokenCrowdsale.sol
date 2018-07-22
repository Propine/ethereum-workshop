pragma solidity ^0.4.4;

import './MyToken.sol';
import 'zeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol';
import 'zeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol';
import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';

contract MyTokenCrowdsale is RefundableCrowdsale, MintedCrowdsale {
  function MyTokenCrowdsale
  (
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _rate,
    address _wallet,
    uint256 _goal,
    MintableToken _token
  )
  public
  Crowdsale(_rate, _wallet, _token)
  TimedCrowdsale(_openingTime, _closingTime)
  FinalizableCrowdsale()
  RefundableCrowdsale(_goal)
  {

  }

}