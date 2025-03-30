use reqwest::Client;
use serde_json::json;

#[tokio::test]
async fn test_generate_level_proof() {
    let client = Client::new();
    let url = "http://127.0.0.1:8080/level_check/generate";

    // Build a sample payload.
    let payload = json!({
        "level": [1, 2, 3, 3, 3],
        "user_indices": [0, 1]
    });

    // Send a POST request to generate a proof.
    let res = client
        .post(url)
        .json(&payload)
        .send()
        .await
        .expect("Failed to send generate proof request");
    assert!(
        res.status().is_success(),
        "Generate endpoint returned error status: {}",
        res.status()
    );

    let response_json: serde_json::Value = res.json().await.expect("Invalid JSON response");
    println!("Generated Proof Response: {:#?}", response_json);

    // Check that the expected fields exist.
    assert!(response_json.get("proof").is_some(), "Missing proof field");
    assert!(
        response_json.get("verifying_key").is_some(),
        "Missing verifying_key field"
    );
}

#[tokio::test]
async fn test_verify_level_proof() {
    let client = Client::new();
    
    // First, generate a proof to be verified.
    let gen_url = "http://127.0.0.1:8080/level_check/generate";
    let payload = json!({
        "level": [1, 2, 3, 3, 3],
        "user_indices": [0, 1]
    });
    
    let gen_res = client
        .post(gen_url)
        .json(&payload)
        .send()
        .await
        .expect("Failed to send generate proof request");
    assert!(
        gen_res.status().is_success(),
        "Generate endpoint returned error status: {}",
        gen_res.status()
    );
    
    let gen_response: serde_json::Value = gen_res.json().await.expect("Invalid JSON response");
    println!("Generated Proof Response: {:#?}", gen_response);

    // Extract the proof and verifying key from the response.
    let proof = gen_response
        .get("proof")
        .and_then(|p| p.as_str())
        .expect("Missing proof field")
        .to_string();
    let verifying_key = gen_response
        .get("verifying_key")
        .and_then(|vk| vk.as_str())
        .expect("Missing verifying_key field")
        .to_string();

    // Now, call the verify endpoint.
    let verify_url = "http://127.0.0.1:8080/level_check/verify";
    let verify_payload = json!({
        "level": [1, 2, 3, 3, 3],
        "proof": proof,
        "verifying_key": verifying_key
    });

    let verify_res = client
        .post(verify_url)
        .json(&verify_payload)
        .send()
        .await
        .expect("Failed to send verify proof request");
    assert!(
        verify_res.status().is_success(),
        "Verify endpoint returned error status: {}",
        verify_res.status()
    );

    let verify_response: serde_json::Value = verify_res.json().await.expect("Invalid JSON response");
    println!("Verification Response: {:#?}", verify_response);

    // Check that the proof_status is true.
    let proof_status = verify_response
        .get("proof_status")
        .and_then(|s| s.as_bool())
        .expect("Missing proof_status field");
    assert!(proof_status, "Proof verification failed");
}
