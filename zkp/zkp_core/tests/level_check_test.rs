use ark_bn254::{Bn254, Fr};
use ark_groth16::{Groth16, prepare_verifying_key};
use zkp_core::level_check::{setup_level_check_circuit, prove_level_check, verify_level_check};

/// Test file for zkp_core logic. Generated by ChatGPT o3-mini model
fn generate_and_verify(level: Vec<u64>, indices: Vec<usize>) -> bool {
    // Determine sizes based on provided arrays.
    let level_size = level.len();

    // Setup the circuit with dynamic sizes.
    let (pk, vk) = setup_level_check_circuit(level_size, indices.clone())
        .expect("Keygen failed");

    // Generate the proof using the provided inputs.
    let proof = prove_level_check(&pk, level.clone(), indices.clone())
        .expect("Proof generation failed");

    // Convert the level array from u64 to Fr for verification.
    let level_fr: Vec<Fr> = level.iter().map(|&n| Fr::from(n)).collect();
    let pvk = prepare_verifying_key(&vk);
    Groth16::<Bn254>::verify_proof(&pvk, &proof, &level_fr)
        .expect("Verification failed")
}

#[test]
fn test_case_1_pass() {
    let level = vec![0, 0, 0, 3, 3, 3, 3, 3, 3];
    // Enforce that the first two elements are > 0.
    let indices = vec![3, 5, 6];
    assert!(generate_and_verify(level, indices), "Test case 1 should pass");
}

#[test]
fn test_case_2_pass() {
    // Level array with a zero at index 0 but we're not checking index 0.
    let level = vec![0, 5, 4, 6];
    let indices = vec![1, 2, 3];
    assert!(generate_and_verify(level, indices), "Test case 2 should pass");
}

#[test]
fn test_case_3_pass() {
    let level = vec![7; 10];
    // Check a few indices across the array.
    let indices = vec![0, 5, 9];
    assert!(generate_and_verify(level, indices), "Test case 3 should pass");
}

#[test]
fn test_case_4_fail() {
    // Level array with a zero at index 1, which is enforced.
    let level = vec![1, 0, 2];
    let indices = vec![1];
    // We expect proof generation to fail, so we catch the panic.
    let result = std::panic::catch_unwind(|| generate_and_verify(level, indices));
    assert!(result.is_err(), "Test case 4 should fail to generate proof");
}
