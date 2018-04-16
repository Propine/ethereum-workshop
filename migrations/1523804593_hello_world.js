module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  const HelloWorld = artifacts.require('HelloWorld');
  deployer.deploy(HelloWorld);
};
