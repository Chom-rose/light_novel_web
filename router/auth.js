const express = require("express");
const router = express.Router();
const { login, authRequired, me } = require("../controller/auth");

// api
router.post("/login", login);
router.get("/me", authRequired, me);

module.exports = router;
