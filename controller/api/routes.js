const express = require("express");
const router = express.Router();

const credentialController = require("../controllers/credentialController");

// Identity endpoints
router.post("/identity/generate", credentialController.generateIndices);
router.post("/identity/enroll", credentialController.enrollIdentity);
router.post("/identity/enrolled", credentialController.checkIdentityEnrolled);

// Credential endpoints
router.post("/credential/generate", credentialController.generateCredential);
router.post("/credential/verifyProof", credentialController.verifyProof);
router.get("/credential/has", credentialController.hasCredential);
router.get("/credential/get", credentialController.getCredential);
router.get("/credential/output", credentialController.getCredentialOutput);

module.exports = router;
