const express = require("express");
const router = express.Router();


const {
  listNovels,
  getNovel,
  createNovel,
  updateNovel,
  deleteNovel,
} = require("../controller/novel");

const { authRequired } = require("../controller/auth");

// API Novels
router.get("/api/novels", listNovels);
router.get("/api/novels/:id", getNovel);
router.post("/api/novels", authRequired, createNovel);
router.put("/api/novels/:id", authRequired, updateNovel);
router.delete("/api/novels/:id", authRequired, deleteNovel);

module.exports = router;
