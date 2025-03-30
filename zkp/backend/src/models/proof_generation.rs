use serde::{Serialize, Deserialize};

/// Request payload for generating a level-checker proof
#[derive(Debug, Serialize, Deserialize)]
pub struct LevelProofGenerationRequest {
    pub level: Vec<u64>,
    pub user_indices: Vec<usize>,
}
