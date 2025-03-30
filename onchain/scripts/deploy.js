// scripts/deploy.js

async function main() {
    // Get the deployer account.
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    // Deploy the HBF contract.
    const HBF = await ethers.getContractFactory("HBF");
    const hbf = await HBF.deploy();
    await hbf.waitForDeployment();
    console.log("HBF deployed to:", hbf.target);
  
    // Deploy the ZKPoH-Credential-Manager contract.
    const CredentialManager = await ethers.getContractFactory("ZKPoHCredentialManager"); // Adjust the contract name if needed.
    const credentialManager = await CredentialManager.deploy();
    await credentialManager.waitForDeployment();
    console.log("ZKPoH-Credential-Manager deployed to:", credentialManager.target);
  
    // Deploy the Verifier contract, passing in the addresses of HBF and Credential Manager.
    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy(hbf.target, credentialManager.target);
    await verifier.waitForDeployment();
    console.log("Verifier deployed to:", verifier.target);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  