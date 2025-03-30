// This module deploys the HBF contract.
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HBFModule", (m) => {
  // Deploy the HBF contract.
  const hbf = m.contract("HBF");
  return { hbf };
});
