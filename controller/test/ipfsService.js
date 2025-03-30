// scripts/ipfsCycle.js
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const { uploadJson, getJson } = require("../services/ipfsService");

async function runCycle() {
  try {
    // Define a sample JSON object.
    const jsonData = { message: "Hello, IPFS!", timestamp: Date.now() };
    
    console.log("Uploading JSON to IPFS...");
    const cid = await uploadJson(jsonData);
    console.log("CID:", cid);
    
    // Extract the CID from the upload result.
    console.log("Retrieving JSON using CID:", cid);
    
    // Retrieve the JSON using the CID.
    const retrievedData = await getJson(cid);
    console.log("Retrieved Data:", retrievedData);
  } catch (error) {
    console.error("Error during IPFS cycle:", error.message);
  }
}

runCycle();
