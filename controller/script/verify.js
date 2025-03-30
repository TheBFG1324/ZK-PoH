const fs = require("fs");
const axios = require("axios");

// Read the JSON file generated previously.
const data = fs.readFileSync("credential_output.json", "utf8");
const proofDataObj = JSON.parse(data);

// Iterate over each proof entry and post to the backend.
(async () => {
  for (const proofEntry of proofDataObj.proofs) {
    // Prepare payload with required fields.
    const payload = {
      verifying_key: proofEntry.verifying_key,
      level: proofEntry.levelArray,
      proof: proofEntry.proof
    };

    try {
      // Hit the backend endpoint at localhost:8080.
      const response = await axios.post("http://127.0.0.1:8080/level_check/verify", payload);
      console.log(`Response for level ${proofEntry.level}:`, response.data);
    } catch (error) {
      console.error(`Error for level ${proofEntry.level}:`, error.message);
    }
  }
})();
