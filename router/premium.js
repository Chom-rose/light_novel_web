const express = require("express");
const router = express.Router();
const { authRequired } = require("../controller/auth");
const { upgrade, cancel } = require("../controller/premium");

router.post("/upgrade", authRequired, upgrade);
router.post("/cancel", authRequired, cancel);

module.exports = router;