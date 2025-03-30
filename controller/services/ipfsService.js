require("dotenv").config();
const { PinataSDK } = require("pinata");

// Init Pinata instance
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY || "turquoise-biological-flamingo-11.mypinata.cloud",
});

// Uploades Json to IPFS using Pinata
async function uploadJson(jsonData) {
  try {
    const result = await pinata.upload.public.json(jsonData);
    console.log("JSON uploaded. CID:", result);
    return result.cid;
  } catch (error) {
    console.error("Error uploading JSON to IPFS via Pinata:", error);
    throw error;
  }
}

// Gets json using CID
async function getJson(cid) {
  try {
    const result = await pinata.gateways.public.get(cid);
    console.log("Data retrieved for CID:", cid);
    return result;
  } catch (error) {
    console.error("Error retrieving JSON from IPFS via Pinata:", error);
    throw error;
  }
}

module.exports = {
  uploadJson,
  getJson,
};
