const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Verifier and Credential Manager Integration", function () {
  let verifier, credentialManager, user;
  // Replace these with your deployed contract addresses (updated to the new contract).
  const verifierAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // example address
  const credentialManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // example address

  before(async function () {
    [user] = await ethers.getSigners();
    verifier = await ethers.getContractAt("Verifier", verifierAddress);
    credentialManager = await ethers.getContractAt("ZKPoHCredentialManager", credentialManagerAddress);
  });

  it("should add a credential when a proof is submitted and batch processed", async function () {
    // Dummy proof submission parameters.
    const ipfsCID = "QmDummyCID";
    const levelIndex = 0; // Example level index.

    // Submit a proof.
    const submitTx = await verifier.connect(user).submitProof(ipfsCID, levelIndex);
    await submitTx.wait();

    // Process the batch. (onlyVerified is a no-op, so any account can call processBatch)
    const processTx = await verifier.connect(user).processBatch();
    await processTx.wait();

    // Retrieve the user's credential from the Credential Manager.
    const cred = await credentialManager.getCredential(user.address);
    // cred is returned as a tuple: (proofs, start, expiration)
    const proofs = cred[0];
    
    // Expect that the proofs array includes our submitted ipfsCID.
    expect(proofs.length).to.be.greaterThan(0);
    expect(proofs[proofs.length - 1]).to.equal(ipfsCID);
  });

  it("should not change the credential if no new proof is submitted", async function () {
    // Get the current credential for the user.
    const credBefore = await credentialManager.getCredential(user.address);
    const beforeProofs = credBefore[0].length;
    
    // Process the batch when the queue is empty.
    const processTx = await verifier.connect(user).processBatch();
    await processTx.wait();

    // Retrieve the credential again.
    const credAfter = await credentialManager.getCredential(user.address);
    const afterProofs = credAfter[0].length;
    
    // Expect that the proofs array length has not increased.
    expect(afterProofs).to.equal(beforeProofs);
  });
});
