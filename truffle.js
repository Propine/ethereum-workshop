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
      from: "0xb28f29e29e61dfd6d1af9d035e5d3d6598b536ea",
      gas: 4600000,
      gasPrice: 10000000000
    }
  }
};