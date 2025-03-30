const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Verifier and Credential Manager Integration", function () {
  let verifier, credentialManager, user;
  // Replace these with your deployed contract addresses.
  const verifierAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // example address
  const credentialManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // example address

  before(async function () {
    [user] = await ethers.getSigners();
    verifier = await ethers.getContractAt("Verifier", verifierAddress);
    credentialManager = await ethers.getContractAt("ZKPoHCredentialManager", credentialManagerAddress);
  });

  it("should add a credential when processProof returns true", async function () {
    // Set up test parameters:
    const proof = "dummyProof";
    const verifyingKey = "dummyVerifyingKey";
    const levelIndex = 0; // use any valid level index; HBF's behavior is mocked/dummy
    const result = true;  // Simulate a successful proof verification.
    const ipfsCID = "QmDummyCID";

    // Call processProof as the user.
    const tx = await verifier.connect(user).processProof(proof, verifyingKey, levelIndex, result, ipfsCID);
    await tx.wait();

    // Retrieve the user's credential from the Credential Manager.
    const cred = await credentialManager.getCredential(user.address);
    // cred is a tuple: (proofs, start, expiration)
    const proofs = cred[0];
    
    // Expect at least one proof to have been added, with the last proof equal to our ipfsCID.
    expect(proofs.length).to.be.greaterThan(0);
    expect(proofs[proofs.length - 1]).to.equal(ipfsCID);
  });

  it("should not add a credential when processProof returns false", async function () {
    // Set up test parameters for a failing verification.
    const proof = "dummyProofFail";
    const verifyingKey = "dummyVerifyingKeyFail";
    const levelIndex = 0;
    const result = false; // Simulate a failed verification.
    const ipfsCID = "QmDummyCIDFail";

    // Capture the current credential proofs length for comparison.
    const before = await credentialManager.getCredential(user.address);
    const beforeProofs = before[0].length;

    // Call processProof with a false result.
    const tx = await verifier.connect(user).processProof(proof, verifyingKey, levelIndex, result, ipfsCID);
    await tx.wait();

    // Retrieve the credential again.
    const after = await credentialManager.getCredential(user.address);
    const afterProofs = after[0].length;

    // Expect that the proofs array length hasn't increased.
    expect(afterProofs).to.equal(beforeProofs);
  });
});
