use ark_groth16::{Proof, ProvingKey, VerifyingKey};
use ark_bn254::Bn254;
use ark_serialize::{CanonicalSerialize, CanonicalDeserialize, Compress, Validate};
use std::io::Cursor;
use base64::{encode, decode};

/// Serializes a proof into a Base64 encoded string.
pub fn serialize_proof(proof: &Proof<Bn254>) -> Result<String, Box<dyn std::error::Error>> {
    let mut bytes = Vec::new();
    proof.serialize_with_mode(&mut bytes, Compress::No)?;
    Ok(encode(&bytes))
}

/// Deserializes a Base64 encoded string into a proof.
pub fn deserialize_proof(encoded: &str) -> Result<Proof<Bn254>, Box<dyn std::error::Error>> {
    let bytes = decode(encoded)?;
    let mut cursor = Cursor::new(bytes);
    let proof = Proof::<Bn254>::deserialize_with_mode(&mut cursor, Compress::No, Validate::No)?;
    Ok(proof)
}

/// Serializes a proving key into a Base64 encoded string.
pub fn serialize_proving_key(pk: &ProvingKey<Bn254>) -> Result<String, Box<dyn std::error::Error>> {
    let mut bytes = Vec::new();
    pk.serialize_with_mode(&mut bytes, Compress::No)?;
    Ok(encode(&bytes))
}

/// Deserializes a Base64 encoded string into a proving key.
pub fn deserialize_proving_key(encoded: &str) -> Result<ProvingKey<Bn254>, Box<dyn std::error::Error>> {
    let bytes = decode(encoded)?;
    let mut cursor = Cursor::new(bytes);
    let pk = ProvingKey::<Bn254>::deserialize_with_mode(&mut cursor, Compress::No, Validate::No)?;
    Ok(pk)
}

/// Serializes a verifying key into a Base64 encoded string.
pub fn serialize_verifying_key(vk: &VerifyingKey<Bn254>) -> Result<String, Box<dyn std::error::Error>> {
    let mut bytes = Vec::new();
    vk.serialize_with_mode(&mut bytes, Compress::No)?;
    Ok(encode(&bytes))
}

/// Deserializes a Base64 encoded string into a verifying key.
pub fn deserialize_verifying_key(encoded: &str) -> Result<VerifyingKey<Bn254>, Box<dyn std::error::Error>> {
    let bytes = decode(encoded)?;
    let mut cursor = Cursor::new(bytes);
    let vk = VerifyingKey::<Bn254>::deserialize_with_mode(&mut cursor, Compress::No, Validate::No)?;
    Ok(vk)
}