 # ZK-PoH: Zero-Knowledge Proof of Humanness

 ZK-PoH is a privacy-preserving biometric authentication system developed during the Midwest Blockathon. Over the course of 20 hours, our team built a cutting-edge solution to verify human identity while safeguarding user privacy. Our system issues time-bound Proof-of-Humanness (PoH) credentials to ensure continuous re-verification and security, making it a powerful tool in cryptography, blockchain, and digital identity management.

 ---

 ## Overview

 ZK-PoH leverages state-of-the-art technologies to create a tamper-resistant and privacy-preserving biometric authentication system. Our solution:

 - Verifies Human Identity: Uses biometric authentication to prove that a digital entity represents a human being and not a bot.
 - Preserves Privacy: Employs zero-knowledge proofs and SHA-256 hashing to authenticate users without revealing sensitive personal data.
 - Ensures Security: Implements time-bound credentials that expire after a set duration, necessitating continuous re-verification.
 - Efficient Biometric Management: Utilizes Hierarchical Bloom Filters for effective storage and management of biometric data.
 - Blockchain Integration: Stores verification credentials on a transparent and immutable blockchain.

 ---

 ## Technology Stack

 #Backend:
 - Rust: Core logic and backend services.
 - ark: Rust package used for generating ZK-SNARK proofs.

 #Smart Contracts  Blockchain:
 - Solidity: Development of smart contracts.
 - Hardhat: Local blockchain development and testing framework.

 #Storage  Pinning:
 - IPFS: Decentralized file storage.
 - Pinata: Pinning service to maintain persistent file availability.

 #Frontends:
 - React: Two separate frontends for PoH credential generation and mock voting.
 - Chakra UI: Component library for streamlined and accessible UI development.

 ---
