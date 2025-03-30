use serde::{Serialize, Deserialize};

/// Request payload for verifying a level-checker proof
#[derive(Debug, Serialize, Deserialize)]
pub struct LevelProofVerificationRequest {
    pub level: Vec<u64>,
    pub proof: String,
    pub verifying_key: String,
}
