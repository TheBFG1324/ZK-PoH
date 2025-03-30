// scripts/zkpCycleCredential.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createHBFInstance, generateIdentity, enrollPerson } = require("../hbf/hbfInstance");
const { 
  insertIdentity, 
  checkIfEnrolled, 
  submitProof, 
  processBatch, 
  isCredentialViable, 
  getCredential 
} = require("../services/contractService");
const { ethers } = require("ethers");

async function runCycleCredential() {
  try {
    // ----- HBF Instance & Identity Generation -----
    const numLevels = 165;   // Number of levels
    const levelSize = 46251; // Size of each level's array
    console.log("Creating HBF instance with", numLevels, "levels and level size", levelSize);
    const hbfInstance = createHBFInstance(numLevels, levelSize);

    console.log("Generating mock identity...");
    // Generate an identity with 3 unique indices per level.
    const identity = generateIdentity(hbfInstance, 3);
    console.log("Generated Identity:", identity);
    console.log("Stored identities in instance:", hbfInstance.identities);

    console.log("Enrolling identity into local HBF instance...");
    enrollPerson(hbfInstance, identity);
    console.log("HBF instance after local enrollment (personCount):", hbfInstance.personCount);

    // ----- On-chain Identity Insertion & Enrollment Check -----
    console.log("Inserting identity on-chain via insertIdentity...");
    const insertReceipt = await insertIdentity(identity);
    console.log("insertIdentity transaction hash:", insertReceipt.transactionHash);

    console.log("Checking if identity is enrolled on-chain via checkIfEnrolled...");
    const enrollmentStatus = await checkIfEnrolled(identity);
    console.log("Enrollment status:", enrollmentStatus);

    // ----- Submit Proof 23 Times -----
    // For the new design, submitProof only needs the IPFS CID and the level index.
    const dummyIpfsCID = "dummyCID";
    const levelIndex = 0; // Example level index

    console.log("Submitting proof 23 times...");
    for (let i = 0; i < 23; i++) {
      console.log(`Submitting proof iteration ${i + 1}...`);
      const receipt = await submitProof(dummyIpfsCID, levelIndex);
      console.log(`Iteration ${i + 1} submission transaction hash:`, receipt);
    }

    // Process the batch (simulate the trusted verifier processing the proofs).
    console.log("Processing batch...");
    const processReceipt = await processBatch();
    console.log("processBatch transaction hash:", processReceipt);

    // ----- Check Credential Viability & Details -----
    const providerInstance = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
    const accounts = await providerInstance.listAccounts();
    const userAddress = accounts[0];
    console.log("Checking credential viability for user:", userAddress);
    const viable = await isCredentialViable(userAddress);
    console.log("Credential viability:", viable);

    console.log("Retrieving credential details for user:", userAddress);
    const credential = await getCredential(userAddress);
    console.log("Credential details:", credential);
  } catch (error) {
    console.error("Error during credential cycle:", error.message);
  }
}

runCycleCredential();
