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
    }
  }
};