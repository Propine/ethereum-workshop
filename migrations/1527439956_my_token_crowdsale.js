const MyTokenCrowdsale = artifacts.require('./MyTokenCrowdsale.sol');
const MyToken = artifacts.require('./MyToken.sol');

module.exports = function(deployer, network, accounts) {
  const openingTime = Math.round((new Date(Date.now() + 180000).getTime())/1000);  // 180000 ms = 3 mins in future
  const closingTime = openingTime + 1200; // 86400 * 20 = 20 days
  const rate = new web3.BigNumber(1);
  const wallet = '0x6147201d01d6cbb9584d97aa7f000e0ee32b01af'; // accounts[1];

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
            2000000000000000000, // Goal: 2 ETH
            MyToken.address
        );
    });
};