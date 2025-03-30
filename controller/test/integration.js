const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const axios = require("axios");

// Base URL for your Express API (adjust the port if needed)
const baseUrl = process.env.API_URL || "http://localhost:3000/api";

async function runIntegrationTest() {
  try {
    // 1. Generate identity indices.
    console.log("Generating identity indices...");
    const genResponse = await axios.post(`${baseUrl}/identity/generate`, {}); // No body parameters needed if defaults are used.
    const identity = genResponse.data.identity;
    console.log("Generated identity indices:", identity);

    // 2. Enroll identity on-chain.
    console.log("Enrolling identity...");
    const enrollResponse = await axios.post(`${baseUrl}/identity/enroll`, { identity });
    console.log("Enroll response:", enrollResponse.data);

    // 4. Generate credential.
    // Here we assume that the generateCredential endpoint takes two parameters:
    //   identityIndices: the identity (2D array) and userAddress.
    // For userAddress, use one defined in your environment (or adjust as needed).
    const userAddress = process.env.USER_ADDRESS || "0xYourUserAddress"; 
    console.log("Generating credential (processing proofs)...");
    const generateCredentialResponse = await axios.post(`${baseUrl}/credential/generate`, {
      identityIndices: identity,
      userAddress: userAddress
    });
    console.log("Credential generated:", generateCredentialResponse.data);

    // 5. Verify proof.
    // For this endpoint, we assume that the request body must include:
    //   ipfsCID: the IPFS CID containing the proof data,
    //   identityIndices: the same identity used for enrollment,
    //   levelIndex: the level to use for the public input.
    console.log("Verifying proof...");
    const verifyProofResponse = await axios.post(`${baseUrl}/credential/verifyProof`, {
      ipfsCID: "dummyCID",         // Replace with an actual CID if available.
      identityIndices: identity,     // Use the generated identity.
      levelIndex: 0                  // Example level index.
    });
    console.log("Proof verification result:", verifyProofResponse.data);

  } catch (error) {
    console.error("Integration test error:", error.response ? error.response.data : error.message);
  }
}

runIntegrationTest();
