const express = require("express");
const router = express.Router();
const path = require("path");
// controller
const { read, create } = require("../controller/novel");

// routes
router.get("/", read);
router.post("/create", create);
 


module.exports = router;