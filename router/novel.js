const express = require("express");
const router = express.Router();
const path = require("path");
// controller
<<<<<<< HEAD
const { read, create } = require("../controller/novel");

// routes
router.get("/", read);
router.post("/create", create);
=======
const { read } = require("../controller/novel");

// routes
router.get("/", read);
>>>>>>> 626a386e48e7e1c81cc649e0acae38601e8e38fb
 


module.exports = router;