require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      // Configuration for the Hardhat network (ideal for testing)
    },
    // You can add other networks like Ropsten, Rinkeby, etc. here.
    // Example of configuring the Ropsten test network:
    // ropsten: {
    //   url: "https://eth-ropsten.alchemyapi.io/v2/your-api-key",
    //   accounts: [`0x${process.env.PRIVATE_KEY}`]
    // }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000 // 20 seconds max for running tests
  }
};
