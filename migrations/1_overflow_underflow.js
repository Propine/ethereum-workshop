module.exports = function(deployer) {
  const OverflowUnderFlow = artifacts.require('OverflowUnderFlow.sol');
  deployer.deploy(OverflowUnderFlow);
};