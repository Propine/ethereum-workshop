module.exports = function(deployer) {
  const OverflowUnderFlowSafe = artifacts.require('OverflowUnderFlowSafe.sol');
  deployer.deploy(OverflowUnderFlowSafe);
};