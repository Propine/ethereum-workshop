module.exports = function(deployer) {
  const MyToken = artifacts.require('MyToken.sol');
  deployer.deploy(MyToken);
};