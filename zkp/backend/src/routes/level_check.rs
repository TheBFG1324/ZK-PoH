use actix_web::web;
use crate::controllers::proof_generator_controller::generate_level_proof;
use crate::controllers::proof_verifier_controller::verify_level_proof;

// Route for proof generation and verification for level-check
pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/level_check")
            .route("/generate", web::post().to(generate_level_proof))
            .route("/verify", web::post().to(verify_level_proof)),
    );
}
