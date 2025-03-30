async function fetchIpfsCIDs() {
    try {
      const response = await fetch('http://localhost:8080/api/credential/output');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the JSON structure is: { proofs: [ { ipfsCID: "...", ... }, ... ] }
      const proofsArray = data.proofs || [];
      // Extract all ipfsCID values, filtering out any undefined ones.
      const ipfsCIDs = proofsArray.map(item => item.ipfsCID).filter(cid => cid !== undefined);
  
      // Generate a list of 165 CIDs by randomly selecting from the fetched IPFS CIDs.
      const totalCIDs = 165;
      const generatedCIDs = [];
      for (let i = 0; i < totalCIDs; i++) {
        // Randomly select an index from the ipfsCIDs array.
        const randomIndex = Math.floor(Math.random() * ipfsCIDs.length);
        generatedCIDs.push(ipfsCIDs[randomIndex]);
      }
  
      return generatedCIDs;
    } catch (error) {
      console.error('Error fetching proofs:', error);
      return [];
    }
  }
  
  module.exports = fetchIpfsCIDs;
  