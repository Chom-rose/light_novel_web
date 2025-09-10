const express = require("express");
const router = express.Router();

const {
mainPage,
createPage,
novelPage,
listNovels,
getNovel,
createNovel,
updateNovel,
deleteNovel,
addChapter,
updateChapter,
deleteChapter,
getChapter
} = require("../controller/novel");

// Pages
router.get("/", mainPage);
router.get("/create", createPage);
router.get("/novel", novelPage); // expects ?id=xxx (novel id)

// API

// Novels
router.get("/api/novels", listNovels);
router.get("/api/novels/:id", getNovel);
router.post("/api/novels", createNovel);
router.put("/api/novels/:id", updateNovel);
router.delete("/api/novels/:id", deleteNovel);

// Chapters
router.get("/api/novels/:id/chapters/:chapterId", getChapter);
router.post("/api/novels/:id/chapters", addChapter);
router.put("/api/novels/:id/chapters/:chapterId", updateChapter);
router.delete("/api/novels/:id/chapters/:chapterId", deleteChapter);


module.exports = router;