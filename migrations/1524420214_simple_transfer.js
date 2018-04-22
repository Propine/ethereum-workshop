module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  const SimpleTransfer = artifacts.require('SimpleTransfer');
  deployer.deploy(SimpleTransfer);
};
