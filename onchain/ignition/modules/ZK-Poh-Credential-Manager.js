// This module deploys the ZKPoH-Credential-Manager contract.
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CredentialManagerModule", (m) => {
  // Deploy the Credential Manager contract.
  const credentialManager = m.contract("ZKPoHCredentialManager");
  return { credentialManager };
});
