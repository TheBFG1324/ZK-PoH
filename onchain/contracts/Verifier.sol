// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZKPoHCredentialManager {
    function addCredential(address user, string memory ipfsCID) external;
}

contract Verifier {
    // Address of the ZK-PoH-Credential-Manager contract.
    IZKPoHCredentialManager public credentialManager;
    
    // Mapping of trusted verifiers (for now not enforced since onlyVerified is a no-op).
    mapping(address => bool) public trustedVerifiers;
    
    // Struct to hold queued proof data.
    struct ProofData {
        string ipfsCID;
        uint256 levelIndex;
        address submitter;
    }
    
    // Array that serves as a batch queue of proofs.
    ProofData[] public proofQueue;
    
    // Events to log submission and processing.
    event ProofQueued(address indexed submitter, uint256 indexed levelIndex, string ipfsCID);
    event ProofProcessed(address indexed submitter, uint256 indexed levelIndex, string ipfsCID);
    
    constructor(address credentialManagerAddress) {
        credentialManager = IZKPoHCredentialManager(credentialManagerAddress);
        // Optionally mark the deployer as trusted.
        trustedVerifiers[msg.sender] = true;
    }
    
    // Modifier that always passes (for testing purposes).
    modifier onlyVerified() {
        _;
    }
    
    /// Submit a proof to the queue.
    /// @param ipfsCID The IPFS CID string representing the proof.
    /// @param levelIndex The level index corresponding to the public input.
    function submitProof(string memory ipfsCID, uint256 levelIndex) public returns (bool) {
        proofQueue.push(ProofData({
            ipfsCID: ipfsCID,
            levelIndex: levelIndex,
            submitter: msg.sender
        }));
        emit ProofQueued(msg.sender, levelIndex, ipfsCID);
        return true;
    }
    
    /// Process all proofs in the queue.
    /// Only a trusted verifier can call this function.
    function processBatch() public onlyVerified returns (bool) {
        for (uint256 i = 0; i < proofQueue.length; i++) {
            ProofData memory data = proofQueue[i];
            // Process each queued proof by adding the credential.
            credentialManager.addCredential(data.submitter, data.ipfsCID);
            emit ProofProcessed(data.submitter, data.levelIndex, data.ipfsCID);
        }
        // Clear the batch queue after processing.
        delete proofQueue;
        return true;
    }
}
