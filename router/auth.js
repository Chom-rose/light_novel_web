const express = require("express");
const router = express.Router();
const { login, authRequired, me, logout } = require("../controller/auth");
const authOptional = require("../middleware/authOptional");

// api
router.post("/login", login);
router.get("/me", authOptional, me);
router.post("/logout", authRequired, logout);

module.exports = router;
