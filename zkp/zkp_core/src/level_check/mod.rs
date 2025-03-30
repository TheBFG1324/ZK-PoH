pub mod witness_calculator;

use ark_bn254::{Bn254, Fr};
use ark_groth16::{Groth16, Proof, VerifyingKey, ProvingKey, prepare_verifying_key};
use ark_relations::r1cs::SynthesisError;
use rand::thread_rng;

use crate::level_check::witness_calculator::{LevelCheckCircuit, create_level_check_witness};

/// One-time trusted setup for level check circuit
pub fn setup_level_check_circuit(
    level_size: usize,
    user_indices: Vec<usize>,
) -> Result<(ProvingKey<Bn254>, VerifyingKey<Bn254>), SynthesisError> {
    if user_indices.len() > level_size {
        return Err(SynthesisError::Unsatisfiable);
    }
    
    // Use dummy level values
    let dummy_level = vec![Fr::from(1u8); level_size];
    
    // Use the actual indices
    let dummy_circuit = LevelCheckCircuit {
        level: dummy_level,
        user_indices,
    };

    let mut rng = thread_rng();
    let params = Groth16::<Bn254>::generate_random_parameters_with_reduction(dummy_circuit, &mut rng)?;
    Ok((params.clone(), params.vk))
}

/// Generate a proof that values at specific indices in `level` are > 0
pub fn prove_level_check(
    proving_key: &ProvingKey<Bn254>,
    level: Vec<u64>,
    indices: Vec<usize>,
) -> Result<Proof<Bn254>, SynthesisError> {
    let circuit = create_level_check_witness(level.clone(), indices);
    let mut rng = thread_rng();
    Groth16::<Bn254>::create_random_proof_with_reduction(circuit, proving_key, &mut rng)
}

/// Verifies the proof that specified indices in level are > 0
pub fn verify_level_check(
    vk: &VerifyingKey<Bn254>,
    proof: &Proof<Bn254>,
    level: &[Fr],
) -> Result<bool, SynthesisError> {
    let pvk = prepare_verifying_key(vk);
    Groth16::<Bn254>::verify_proof(&pvk, proof, level)
}
