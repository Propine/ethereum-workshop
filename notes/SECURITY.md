# Security in smart contracts

## Overview
* Smart contracts are "immutable". That means once they are deployed, it is not possible to change the code and such, impossible to patch any bugs discovered after deployment.

* Smart contracts are usually high in value so there are more people keen to take chance to find bugs for exploits.

* It is extremely important to write smart contracts that are well tested, as clear and concise as possible, and adhere to the latest standard in security guidelines.

* Smart contracts developments are unlike traditional software developments where we can discover and patch bugs after release. So a different approach and mindset are needed to develop them.

* In general, we want to do the following,
  * Keep the code simple and clear
  * Use audited and tested code
  * Write as many unit tests/ tests as possible
  * Stay updated and follow the latest security guidelines/ standard

## Securing smart contracts

Ref:

https://medium.com/loom-network/how-to-secure-your-smart-contracts-6-solidity-vulnerabilities-and-how-to-avoid-them-part-1-c33048d4d17d

We will go through 1 example from the reference.

### Overflows & Underflows

#### Problem

* Underflows are more likely to happen. That is when attacker has N balance, and attempts to spend N-1 which will result in attacker gaining more token than he actually has, which is the max balance possible.

* Let's try to reproduce the bug.

* Open Powershell/ terminal, navigate to workshop directory and create OverflowUnderFlow contract:
  ```
  truffle create contract OverflowUnderFlow
  ```

* Open the created .sol file and overwrite the content with following:
  ```
  pragma solidity ^0.4.4;

  // Contract to test unsigned integer underflows and overflows
  // note: uint in solidity is an alias for uint256

  contract OverflowUnderFlow {
    uint public zero = 0;
    uint public max = 2**256-1;

    // zero will end up at 2**256-1
    function underflow() public {
        zero -= 1;
    }
    // max will end up at 0
    function overflow() public {
        max += 1;
    }
  }
  ```

* Let's create migration file by hand. Create a new file under `migrations` folder and name it `1_overflow_underflow.js`

* Add this in the migration file:
  ```
  module.exports = function(deployer) {
    const OverflowUnderFlow = artifacts.require('OverflowUnderFlow.sol');
    deployer.deploy(OverflowUnderFlow);
  };
  ```

* Move the rest of the migration files elsewhere as we do not want to deploy the rest of the contracts at the moment.

* Check your truffle.js to ensure the setting is correct (you should use your own account).

* Make sure your account has fund as well, otherwise request funding from http://faucet.ropsten.be:3001/

* Launch another PowerShell/ terminal and connect to ropsten testnet:
  ```
  geth attach http://13.229.195.247:8545
  ```

* Unlock your account as usual:
  ```
  personal.unlockAccount("0x...your account address ...", "AwesomePassphrase", 600)
  ```

* Go back to the code terminal and run these steps:
  ```
  truffle compile
  ```
  ```
  truffle migrate --network ropsten --reset
  ```
  Expect to see something like following output.
  ```
  Using network 'ropsten'.

  Running migration: 1_overflow_underflow.js
    Deploying OverflowUnderFlow...
    ... 0x1126b7b0e3099c13bdb3c1ba98c4990c7620d9599d44139b8e45a0584ee84bba
    OverflowUnderFlow: 0xf78c18d6a7e8f8cd2d6562b6352b2914c09b79a0
  Saving successful migration to network...
    ... 0x9801a2f9ab922465d83bb913c1e663acf3f69c22facf8569f89726e46023db43
  Saving artifacts...
  ```

* And finally, launch the console to interact with contract
  ```
  truffle console --network ropsten
  ```

* Start by instantiating the contract.
  ```
  OverflowUnderFlow.deployed().then(inst => { overunder = inst })
  ```
  Expect to see
  ```
  Undefined
  ```

* Check the zero:
  ```
  overunder.zero().then(balance => p = web3.fromWei(balance.toString(10), "ether"))
  ```
  Expect to see
  ```
  '0'
  ```
  Note: You can also run `overunder.zero()` to see the raw format which will be like this.
  ```
  BigNumber { s: 1, e: 0, c: [ 0 ] }
  ```

* So let's try to _underflow_
  ```
  overunder.underflow()
  ```
  Expect to see something similar to this.
  ```
  { tx: '0x987e045e4ef63de47d40e8227c9c18b15f02f7bad5c1d44f00b7feada76df83d',
    receipt:
     { blockHash: '0xf493de61759dd0b35b248e250ab4adeb4bbf154cbe3a4ed3908ac5a4ab372ffa',
       blockNumber: 3689830,
       contractAddress: null,
       cumulativeGasUsed: 41699,
       from: '0x62398513fd559f850c79b646c0c84621d6f0e2cd',
       gasUsed: 41699,
       logs: [],
       logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
       status: '0x1',
       to: '0x7eebb1e236cebc8eb575791a713309e04a2f8711',
       transactionHash: '0x987e045e4ef63de47d40e8227c9c18b15f02f7bad5c1d44f00b7feada76df83d',
       transactionIndex: 0 },
    logs: [] }
  ```

* What is the value of zero now?
  ```
  overunder.zero().then(balance => p = web3.fromWei(balance.toString(10), "ether"))
  ```
  ```
  '115792089237316195423570985008687907853269984665640564039457.584007913129639935'
  ```
  Not good, attacker has gained maximum token.

* Similary check `max` and run the `overflow()` too to see what will happen.
  (The whole ether will be gone ^^; )

#### Mitigation

* We use OpenZeppelin libraries because they have security in place such that we do not need to reinvent the wheel.

* The `SafeMath` library will prevent this overflow/ underflow issue from happening.

* Let's try it. Create new contract `OverflowUnderFlowSafe.sol` to use SafeMath like so,
  ```
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
  ```

* And the accompanying migration file `2_overflow_underflow_safe.js`:
  ```
  module.exports = function(deployer) {
    const OverflowUnderFlowSafe = artifacts.require('OverflowUnderFlowSafe.sol');
    deployer.deploy(OverflowUnderFlowSafe);
  };
  ```

* You will want to save gas by moving `1_overflow_underflow.js` elsewhere.

* Exit previous truffle console, then do truffle compile, deploy the contract and launch truffle console for it.
  This is what we should expect from deployment.
  ```
  Running migration: 2_overflow_underflow_safe.js
    Deploying OverflowUnderFlowSafe...
    ... 0x45ab07fc6ef67311d37350e501abd35471bce29fcd339ebf61d082b81d6733c1
    OverflowUnderFlowSafe: 0x512b3d4ed57ff6597ef374f98a7fc4b395623fe9
  Saving successful migration to network...
    ... 0xb7f0e063ba4416f3ed1a4815b2557b6e159caaa18aedcc71126f4da717abc9c6
  Saving artifacts...
  ```

* Do the same test as earlier and see if the bug will happen.
  ```
  OverflowUnderFlowSafe.deployed().then(inst => { overunder = inst })
  ```
  ```
  overunder.zero().then(balance => p = web3.fromWei(balance.toString(10), "ether"))
  ```
  // '0'
  ```
  overunder.underflow()
  ```
  ```
  overunder.zero().then(balance => p = web3.fromWei(balance.toString(10), "ether"))
  ```
  Expect to see
  ```
  Error: Transaction: 0x1bc9a0e536f8687a159939f8b09b0d3d42ae43bf7f1792ee71166d9f4dc45271 exited with an error (status 0) after consuming all gas.
  Please check that the transaction:
      - satisfies all conditions set by Solidity `assert` statements.
      - has enough gas to execute the full transaction.
      - does not trigger an invalid opcode by other means (ex: accessing an array out of bounds).
  ...
  ```
  That is because we are trying to do `0-1` which failed the assertion in SafeMath. (Note the `assert` in `sub` function)

### What is next
* Many guidelines are discussed in the following links.
  1. [How to Secure Your Smart Contracts Part 1](https://medium.com/loom-network/how-to-secure-your-smart-contracts-6-solidity-vulnerabilities-and-how-to-avoid-them-part-1-c33048d4d17d)
  2. [How to Secure Your Smart Contracts Part 2](https://medium.com/loom-network/how-to-secure-your-smart-contracts-6-solidity-vulnerabilities-and-how-to-avoid-them-part-2-730db0aa4834)
  3. [Documentation from Solidity](http://solidity.readthedocs.io/en/latest/security-considerations.html)
  4. [ConsenSys Smart Contract Security Best Practices](https://github.com/ConsenSys/smart-contract-best-practices)
      Note the [Recommendations for smart contract in Solidity](https://consensys.github.io/smart-contract-best-practices/recommendations/)

  And many more documentations and white paper available online.

  Do read through the guidelines so as to be able to write a secure smart contracts.