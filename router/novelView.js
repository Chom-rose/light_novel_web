const express = require("express");
const router = express.Router();
const novelView = require("../controller/novelView");

// View routes
router.get("/write/:id", novelView.renderWrite);
router.get("/write_chapter/:id", novelView.renderWriteChapter);
router.get("/novel/:id", novelView.renderNovelDetail);

module.exports = router;