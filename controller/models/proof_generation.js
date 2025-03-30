
// Level proof request
class LevelProofGenerationRequest {
    /**
     * @param {number[]} level - An array of public level values.
     * @param {number[]} user_indices - An array of indices (private values) to be checked.
     */
    constructor(level, user_indices) {
      this.level = level;
      this.user_indices = user_indices;
    }
  }
  
  // Repsonse from generation request
  class GeneratedProof {
    /**
     * @param {string} proof - The Base64-encoded proof string.
     * @param {string} verifyingKey - The Base64-encoded verifying key.
     */
    constructor(proof, verifyingKey) {
      this.proof = proof;
      this.verifyingKey = verifyingKey;
    }
  }
  
  module.exports = {
    LevelProofGenerationRequest,
    GeneratedProof,
  };
  