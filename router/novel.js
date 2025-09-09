const express = require("express");
const router = express.Router();
const path = require("path");
// controller
const { read } = require("../controller/novel");

// routes
router.get("/", read);
 


module.exports = router;