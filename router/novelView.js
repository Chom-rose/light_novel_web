const express = require("express");
const router = express.Router();
const novelView = require("../controller/novelView");
const authOptional = require("../middleware/authOptional");
const chapter = require("../controller/chapter");

// View routes
router.get("/write/:id", novelView.renderWrite);
router.get("/write_chapter/:id", novelView.renderWriteChapter);
router.get("/novel/:id",authOptional, novelView.renderNovelDetail);
router.get("/novel/:id/chapter/:chapterId",authOptional, chapter.readChapter);

module.exports = router;