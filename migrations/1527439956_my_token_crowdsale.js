const MyTokenCrowdsale = artifacts.require('./MyTokenCrowdsale.sol');
const MyToken = artifacts.require('./MyToken.sol');

module.exports = function(deployer, network, accounts) {
  const openingTime = 1527469032 + 86400; // web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
  const closingTime = openingTime + 86400 * 20; // 20 days
  const rate = new web3.BigNumber(1);
  const wallet = accounts[1];

  return deployer
    .then(() => {
        return deployer.deploy(MyToken);
    })
    .then(() => {
        return deployer.deploy(
            MyTokenCrowdsale,
            openingTime,
            closingTime,
            rate,
            wallet,
            MyToken.address
        );
    });
};