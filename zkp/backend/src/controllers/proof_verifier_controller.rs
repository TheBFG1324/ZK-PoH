use actix_web::{web, HttpResponse, Responder};
use ark_bn254::Fr;
use zkp_core::level_check::verify_level_check;
use crate::utils::utils::{deserialize_proof, deserialize_verifying_key};
use crate::models::proof_verification::LevelProofVerificationRequest;
use crate::models::response::ProofStatus;

/// Verifies a level-check proof using the provided verifying key and level array.
pub async fn verify_level_proof(req: web::Json<LevelProofVerificationRequest>) -> impl Responder {
    // Deserialize the verifying key.
    let vk = match deserialize_verifying_key(&req.verifying_key) {
        Ok(key) => key,
        Err(e) => return HttpResponse::InternalServerError()
            .body(format!("Verifying key deserialization error: {:?}", e)),
    };

    // Deserialize the proof.
    let proof = match deserialize_proof(&req.proof) {
        Ok(p) => p,
        Err(e) => return HttpResponse::BadRequest()
            .body(format!("Proof deserialization error: {:?}", e)),
    };

    // Convert the level array from u64 to Fr.
    let level_fr: Vec<Fr> = req.level.iter().map(|&n| Fr::from(n)).collect();

    // Verify the proof.
    let verified = match verify_level_check(&vk, &proof, &level_fr) {
        Ok(result) => result,
        Err(e) => return HttpResponse::InternalServerError()
            .body(format!("Verification error: {:?}", e)),
    };

    let response = ProofStatus { proof_status: verified };
    HttpResponse::Ok().json(response)
}
