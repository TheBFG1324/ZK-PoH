const express = require("express");
const router = express.Router();

const proofController = require("../controllers/proofController");

// Identity endpoints
router.post("/identity/generate", proofController.generateIndices);
router.post("/identity/enroll", proofController.enrollIdentity);
router.post("/identity/enrolled", proofController.checkIdentityEnrolled);

// Credential endpoints
router.post("/credential/generate", proofController.generateCredential);
router.post("/credential/verifyProof", proofController.verifyProof);
router.get("/credential/has", proofController.hasCredential);
router.get("/credential/get", proofController.getCredential);

module.exports = router;
