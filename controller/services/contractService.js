require("dotenv").config();
const { ethers } = require("ethers");

// Connect to Hardhat
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Create a signer using a private key from .env
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("Please set PRIVATE_KEY in your .env file");
}
const signer = new ethers.Wallet(privateKey, provider);

// Deployed contract addresses from .env
const hbfAddress = process.env.HBF_ADDRESS;
const verifierAddress = process.env.VERIFIER_ADDRESS;
const credentialManagerAddress = process.env.CREDENTIAL_MANAGER_ADDRESS;

// Load contract ABIs. Adjust the paths to match your project structure.
const HBF_ABI = require("./abi/HBF.json");
const Verifier_ABI = require("./abi/Verifier.json");
const CredentialManager_ABI = require("./abi/PoH.json");

/**
 * Inserts an identity into the HBF contract.
 * @param {Array<Array<number>>} person - A 2D array representing the identity.
 */
async function insertIdentity(person) {
  const hbfContract = new ethers.Contract(hbfAddress, HBF_ABI, signer);
  const tx = await hbfContract.insertIdentity(person);
  const receipt = await tx.wait();
  return receipt;
}

/**
 * Checks if a person is enrolled in the HBF contract.
 * @param {Array<Array<number>>} person - A 2D array representing the identity.
 */
async function checkIfEnrolled(person) {
  const hbfContract = new ethers.Contract(hbfAddress, HBF_ABI, provider);
  const passCount = await hbfContract.checkIfEnrolled(person);
  return passCount;
}

/**
 * Submits a proof to the Verifier contract's queue.
 * @param {string} ipfsCID - The IPFS CID representing the proof.
 * @param {number} levelIndex - The level index corresponding to the proof's public input.
 */
async function submitProof(ipfsCID, levelIndex) {
  const verifierContract = new ethers.Contract(verifierAddress, Verifier_ABI, signer);
  const tx = await verifierContract.submitProof(ipfsCID, levelIndex);
  const receipt = await tx.wait();
  return receipt;
}

/**
 * Processes the entire proof queue on-chain.
 * @returns {Promise<Object>} The transaction receipt.
 */
async function processBatch() {
  const verifierContract = new ethers.Contract(verifierAddress, Verifier_ABI, signer);
  const tx = await verifierContract.processBatch();
  const receipt = await tx.wait();
  return receipt;
}

/**
 * Checks if a user has a viable credential via the Credential Manager.
 * @param {string} userAddress - The user's address.
 */
async function isCredentialViable(userAddress) {
  const credentialContract = new ethers.Contract(credentialManagerAddress, CredentialManager_ABI, provider);
  const viable = await credentialContract.isCredentialViable(userAddress);
  return viable;
}

/**
 * Retrieves a user's credential information from the Credential Manager.
 * @param {string} userAddress - The user's address.
 */
async function getCredential(userAddress) {
  const credentialContract = new ethers.Contract(credentialManagerAddress, CredentialManager_ABI, provider);
  const credential = await credentialContract.getCredential(userAddress);
  return {
    proofs: credential.proofs,
    start: credential.start.toString(),
    expiration: credential.expiration.toString(),
  };
}

module.exports = {
  insertIdentity,
  checkIfEnrolled,
  submitProof,
  processBatch,
  isCredentialViable,
  getCredential,
};
