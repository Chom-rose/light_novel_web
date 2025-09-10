const express = require("express");
const router = express.Router();
const path = require("path");
// controller

const { read, create, read_create,  read_write ,read_write_chapter, read_search} = require("../controller/novel");

// routes
router.get("/", read);
router.post("/create", create);
router.get("/create", read_create);
router.get("/write", read_write);
router.get("/write_chapter", read_write_chapter); 
router.get("/search", read_search);

module.exports = router;