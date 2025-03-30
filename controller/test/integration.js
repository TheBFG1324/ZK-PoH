const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const axios = require("axios");

// Base URL for your Express API (adjust the port if needed)
const baseUrl = process.env.API_URL || "http://localhost:3000/api";

async function runIntegrationTest() {
  try {
    console.log("Fetching credential output...");
    const response = await axios.get(`${baseUrl}/credential/output`);
    console.log("Credential output:", response.data);
  } catch (error) {
    console.error("Integration test error:", error.response ? error.response.data : error.message);
  }
}

runIntegrationTest();
