pragma solidity ^0.4.4;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract OverflowUnderFlowSafe {
    using SafeMath for uint;
    uint public zero = 0;
    uint public max = 2**256-1;

    // Will throw
    function underflow() public {
        zero = zero.sub(1);
    }
    // Will throw
    function overflow() public {
        max = max.add(1);
    }

// Contract to test unsigned integer underflows and overflows
// note: uint in solidity is an alias for uint256

// After deployment, call overflow and underflow and check the values of max and zero again
}