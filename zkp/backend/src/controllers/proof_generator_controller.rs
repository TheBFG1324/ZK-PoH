use actix_web::{web, HttpResponse, Responder};
use zkp_core::level_check::{setup_level_check_circuit, prove_level_check};
use crate::utils::utils::{serialize_proving_key, serialize_verifying_key, serialize_proof};
use crate::models::proof_generation::LevelProofGenerationRequest;
use crate::models::response::GeneratedProof;

/// Generates a level-check proof along with freshly generated keys.
pub async fn generate_level_proof(req: web::Json<LevelProofGenerationRequest>) -> impl Responder {
    // Extract level array and user indices from the request.
    let level = req.level.clone();
    let user_indices = req.user_indices.clone();
    let level_size = level.len();

    // Setup the circuit using the actual user_indices.
    let (pk, vk) = match setup_level_check_circuit(level_size, user_indices.clone()) {
        Ok(keys) => keys,
        Err(e) => return HttpResponse::InternalServerError()
            .body(format!("Circuit setup error: {:?}", e)),
    };

    // Generate the proof using the provided level array and indices.
    let proof = match prove_level_check(&pk, level.clone(), user_indices) {
        Ok(p) => p,
        Err(e) => return HttpResponse::InternalServerError()
            .body(format!("Proof generation error: {:?}", e)),
    };

    // Serialize values
    let verifying_key_str = match serialize_verifying_key(&vk) {
        Ok(s) => s,
        Err(e) => return HttpResponse::InternalServerError()
            .body(format!("Verifying key serialization error: {:?}", e)),
    };

    let proof_str = match serialize_proof(&proof) {
        Ok(s) => s,
        Err(e) => return HttpResponse::InternalServerError()
            .body(format!("Proof serialization error: {:?}", e)),
    };

    // Return the proof and keys as JSON.
    let response = GeneratedProof {
        proof: proof_str,
        verifying_key: verifying_key_str,
    };

    HttpResponse::Ok().json(response)
}
