const express = require("express");
const router = express.Router();


const {
  mainPage,
  createPage,
  writePage,
  write_chapterPage,
  searchPage,
  loginPage,
  registerPage,
  listNovels,
  getNovel,
  createNovel,
  updateNovel,
  deleteNovel,
} = require("../controller/novel");

const { authRequired } = require("../controller/auth");

// Pages แก้ตรงนี้ด้วย
router.get("/", mainPage);
router.get("/create", createPage);
router.get("/novel", writePage);
router.get("/novel/:id", write_chapterPage);
router.get("/search", searchPage);
router.get("/login", loginPage);
router.get("/register", registerPage);

// API Novels
router.get("/api/novels", listNovels);
router.get("/api/novels/:id", getNovel);
router.post("/api/novels", authRequired, createNovel);
router.put("/api/novels/:id", authRequired, updateNovel);
router.delete("/api/novels/:id", authRequired, deleteNovel);

module.exports = router;