const fs = require("fs");
const { createHBFInstance, generateIdentity, enrollPerson } = require("../hbf/hbfInstance");
const { 
  insertIdentity, 
  checkIfEnrolled, 
  isCredentialViable, 
  getCredential,
  submitProof
} = require("../services/contractService");
const { 
    uploadJson,
    getJson
 } = require("../services/ipfsService");
const { 
    generateProof,
    verifyProof
 } = require("../services/zkpService");

// Default HBF configuration (adjust as needed)
const NUM_LEVELS = 165;
const LEVEL_SIZE = 46251;
const INDICES_COUNT = 3;
const PROOF_THRESHOLD = 21;

module.exports = {
  // GenerateIndices: creates an HBF instance and generates identity indices.
  generateIndices: async (req, res) => {
    try {

      const indicesCount = INDICES_COUNT;

      // Create a new HBF instance and generate the identity indices.
      const hbfInstance = createHBFInstance(NUM_LEVELS, LEVEL_SIZE);
      const identity = generateIdentity(hbfInstance, indicesCount);

      return res.status(200).json({ identity });
    } catch (error) {
      console.error("Error generating indices:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Enroll Identity: enrolls an identity locally (via HBF) and on-chain.
  enrollIdentity: async (req, res) => {
    try {
      const { identity } = req.body;
      if (!identity) {
        return res.status(400).json({ error: "Identity data missing" });
      }
      
      // Enroll identity in local HBF instance.
      const hbfInstance = createHBFInstance(NUM_LEVELS, LEVEL_SIZE);
      enrollPerson(hbfInstance, identity);

      // Insert the identity on-chain.
      const receipt = await insertIdentity(identity);
      return res.status(200).json({ message: "Identity enrolled", receipt });
    } catch (error) {
      console.error("Error enrolling identity:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Check if Identity is Enrolled: verifies on-chain whether the identity is enrolled.
  checkIdentityEnrolled: async (req, res) => {
    try {
      const { identity } = req.body;
      if (!identity) {
        return res.status(400).json({ error: "Identity data missing" });
      }
      
      const enrolled = await checkIfEnrolled(identity);
      return res.status(200).json({ enrolled });
    } catch (error) {
      console.error("Error checking identity enrollment:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Generate Credential: processes a proof using HBF data and identity indices to generate a credential.
  generateCredential: async (req, res) => {
    try {
      const { identityIndices, userAddress } = req.body;
      if (!identityIndices || !userAddress) {
        return res.status(400).json({ error: "Missing identity indices or user address" });
      }
      
      // Update local HBF instance by enrolling the user identity.
      const hbfInstance = createHBFInstance(NUM_LEVELS, LEVEL_SIZE);
      enrollPerson(hbfInstance, identityIndices);

      // This array will hold the proof details for each level.
      let proofCollection = [];

      // Loop through levels to generate and submit proofs.
      for (let level = 0; level < PROOF_THRESHOLD; level++) {
        // Retrieve the level array from the local HBF instance for the current level.
        const levelArray = hbfInstance.levels[level];
        
        // Get the user's index at the current level.
        const userIndexes = identityIndices[level];
        if (userIndexes === undefined) {
          return res.status(400).json({ error: `Missing index for level ${level}` });
        }
        
        // Generate the proof and verifying key by calling the ZKP backend.
        const proofResponse = await generateProof(levelArray, userIndexes);
        console.log("Proof generation response:", proofResponse);
        const { proof, verifying_key } = proofResponse;
        
        // Upload the generated proof data to IPFS.
        const ipfsCID = await uploadJson({ proof, verifying_key });
        
        // Save proof data into our collection.
        proofCollection.push({
          level: level,
          proof: proof,
          verifying_key: verifying_key,
          levelArray: levelArray,
          ipfsCID: ipfsCID
        });
        
        // Call the verifier contract with the generated proof data.
        const receipt = await submitProof(ipfsCID, level);
        console.log(`Proof for level ${level} submitted. Transaction hash: ${receipt}`);
      }
      
      // Write the collected proof data to a file.
      fs.writeFileSync("credential_output.json", JSON.stringify({ proofs: proofCollection }, null, 2));
      console.log("Proof data written to credential_output.json");

      // Process batch if needed.
      console.log("processing batch");
      const processReceipt = await processBatch();
      console.log("done processing batch: ", processReceipt);

      // Once the threshold is reached, retrieve the credential from the blockchain.
      const credential = await getCredential(userAddress);
      return res.status(200).json({ credential });
    } catch (error) {
      console.error("Error generating credential:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // HasCredential: checks if a given user has a valid credential on-chain.
  hasCredential: async (req, res) => {
    try {
      // Accept user address as a query parameter or in the request body.
      const { userAddress } = req.query;
      if (!userAddress) {
        return res.status(400).json({ error: "User address missing" });
      }
      
      const valid = await isCredentialViable(userAddress);
      return res.status(200).json({ hasCredential: valid });
    } catch (error) {
      console.error("Error checking credential:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // GetCredential: retrieves a user's credential information from the blockchain.
  getCredential: async (req, res) => {
    try {
      const { userAddress } = req.query;
      if (!userAddress) {
        return res.status(400).json({ error: "User address missing" });
      }
      
      const credential = await getCredential(userAddress);
      return res.status(200).json({ credential });
    } catch (error) {
      console.error("Error retrieving credential:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Verify Proof: Enrolls the user locally, then retrieves the proof data from IPFS,
  // then retrieves the local HBF level array for the given level, and finally calls the ZKP backend to verify the proof.
  verifyProof: async (req, res) => {
    try {
      const { ipfsCID, identityIndices, levelIndex } = req.body;
      if (!ipfsCID || !identityIndices || levelIndex === undefined) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      
      // Re-create the local HBF instance and enroll the user using the provided identityIndices.
      const hbfInstance = createHBFInstance(NUM_LEVELS, LEVEL_SIZE);
      enrollPerson(hbfInstance, identityIndices);
      
      // Retrieve the proof data from IPFS.
      const proofData = await getJson(ipfsCID);
      // Expect proofData to be a JSON object with fields "proof" and "verifying_key"
      const { proof, verifying_key } = proofData;
      
      // Retrieve the local HBF level array for the specified level.
      const levelArray = hbfInstance.levels[levelIndex];
      
      // Call the ZKP backend verification function.
      const verifyResponse = await verifyProof(levelArray, proof, verifying_key);
      
      return res.status(200).json({ proof_status: verifyResponse.proof_status });
    } catch (error) {
      console.error("Error verifying proof:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};
