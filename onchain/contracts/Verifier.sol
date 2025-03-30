// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHBF {
    function getLevelArray(uint256 level) external view returns (uint256[] memory);
}

interface IZKPoHCredentialManager {
    function addCredential(address user, string memory ipfsCID) external;
}

contract Verifier {
    // Address of the HBF contract.
    IHBF public hbf;
    // Address of the ZK-PoH-Credential-Manager contract.
    IZKPoHCredentialManager public credentialManager;

    // Events to log function parameters.
    event ProofVerified(
        string proof,
        string verifyingKey,
        bool result,
        uint256[] levelArray
    );

    event ProofProcessed(
        string proof,
        string verifyingKey,
        uint256 levelIndex,
        bool result,
        string ipfsCID,
        bool verified,
        address sender
    );

    constructor(address hbfAddress, address credentialManagerAddress) {
        hbf = IHBF(hbfAddress);
        credentialManager = IZKPoHCredentialManager(credentialManagerAddress);
    }

    /// Basic verification function.
    /// In a real implementation, this would verify the proof with the verifying key and public input.
    function verifyProof(
        string memory proof,
        string memory verifyingKey,
        bool result,
        uint256[] memory levelArray
    ) public returns (bool) {
        // Emit event showing all parameters are received.
        emit ProofVerified(proof, verifyingKey, result, levelArray);
        return result;
    }

    /// Process a proof: retrieves the level array from HBF at a given level index, verifies the proof,
    /// and if successful, calls the Credential Manager to add the credential.
    function processProof(
        string memory proof,
        string memory verifyingKey,
        uint256 levelIndex,
        bool result,
        string memory ipfsCID
    ) public returns (bool) {
        uint256[] memory levelArray = hbf.getLevelArray(levelIndex);
        bool verified = verifyProof(proof, verifyingKey, result, levelArray);
        if (verified) {
            credentialManager.addCredential(msg.sender, ipfsCID);
        }

        // Emit event with all parameters and the verification result.
        emit ProofProcessed(proof, verifyingKey, levelIndex, result, ipfsCID, verified, msg.sender);
        return verified;
    }
}
