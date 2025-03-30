// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZKPoHCredentialManager {
    // Threshold of proofs needed for a credential to be considered "active".
    uint256 public constant THRESHOLD = 21;
    // Expiration period set to one month (30 days).
    uint256 public constant EXPIRATION_PERIOD = 2592000;
    
    struct Credential {
        string[] proofs;
        uint256 start;
        uint256 expiration;
    }

    mapping(address => Credential) public credentials;

    // Address valid proof to user's credential
    function addCredential(address user, string memory ipfsCID) external {
        Credential storage cred = credentials[user];

        // Check if a credential exists and is not expired.
        if (cred.start != 0 && block.timestamp < cred.start + cred.expiration) {
            // Credential is valid; append the new proof.
            cred.proofs.push(ipfsCID);
        } else {
            // No valid credential exists; reset/create a new credential.
            delete cred.proofs;
            cred.proofs.push(ipfsCID);
            cred.start = block.timestamp;
            cred.expiration = EXPIRATION_PERIOD;
        }
    }

    // checks if a credential is valid
    function isCredentialViable(address user) external view returns (bool) {
        Credential storage cred = credentials[user];
        if (cred.start == 0) {
            return false;
        }
        bool notExpired = block.timestamp < cred.start + cred.expiration;
        bool active = cred.proofs.length >= THRESHOLD;
        return notExpired && active;
    }

   // Gets a user's credential information
    function getCredential(address user) external view returns (string[] memory proofs, uint256 start, uint256 expiration) {
        Credential storage cred = credentials[user];
        return (cred.proofs, cred.start, cred.expiration);
    }
}
