
// Level verification request
class LevelProofVerificationRequest {
    /**
     * @param {number[]} level - An array of public level values.
     * @param {string} proof - A Base64-encoded proof string.
     * @param {string} verifyingKey - A Base64-encoded verifying key string.
     */
    constructor(level, proof, verifyingKey) {
      this.level = level;
      this.proof = proof;
      this.verifyingKey = verifyingKey;
    }
  }
  
  // Result of a proof's verification
  class ProofStatus {
    /**
     * @param {boolean} proofStatus - The result of the proof verification.
     */
    constructor(proofStatus) {
      this.proof_status = proofStatus;
    }
  }
  
  module.exports = {
    LevelProofVerificationRequest,
    ProofStatus,
  };
  