module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost", 
      port: 8545,
      network_id: "4", //main net id is 1, 
      from: "0xb3881106cff32580c0a5321fdc907ab9f7a7dfc6",
      gas: 200000 
    },
    ropsten: {
      host: "13.229.195.247",
      port: 8545,
      network_id: "3",
      from: "0xca275fd95d26c00c9d650f99d5f0ffbe5d344c18",
      gas: 4500000
    }
  }
};