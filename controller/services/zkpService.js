const axios = require("axios");

const ZKP_BACKEND_URL = process.env.ZKP_BACKEND_URL || "http://localhost:8080/level_check";

// Generates proof
async function generateProof(level, user_indices) {
  try {
    const response = await axios.post(`${ZKP_BACKEND_URL}/generate`, {
      level,
      user_indices,
    });

    return response.data; // { proof: String, verifyingKey: String }
  } catch (error) {
    console.error("ZKP Proof Generation Error:", error.response?.data || error.message);
    throw new Error("Failed to generate ZKP proof");
  }
}

// Verifies proof
async function verifyProof(level, proof, verifyingKey) {
  try {
    const response = await axios.post(`${ZKP_BACKEND_URL}/verify`, {
      level,
      proof,
      verifying_key: verifyingKey,
    });

    return response.data; // { proof_status: boolean }
  } catch (error) {
    console.error("ZKP Proof Verification Error:", error.response?.data || error.message);
    throw new Error("Failed to verify ZKP proof");
  }
}

module.exports = {
  generateProof,
  verifyProof,
};
