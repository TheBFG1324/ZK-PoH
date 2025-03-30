require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 0    
      }
    }
  }
};
