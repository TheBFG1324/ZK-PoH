async function fetchProofs() {
    try {
      const response = await fetch('http://localhost:8080/api/credential/output');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the JSON structure is: { proofs: [ { proof: "...", verifying_key: "..." }, ... ] }
      const proofsArray = data.proofs || [];
      const extracted = proofsArray.map(item => ({
        proof: item.proof,
        verifying_key: item.verifying_key
      }));
      return extracted;
    } catch (error) {
      console.error('Error fetching proofs:', error);
      return [];
    }
  }

  module.exports = fetchProofs;
  