const express = require("express");
const router = express.Router();


const {
  mainPage,
  createPage,
  read_write,
  read_write_chapter,
  read_search,
  read_login,
  read_register,
  novelPage,
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
router.get("/write", read_write);
router.get("/write_chapter", read_write_chapter);
router.get("/search", read_search);
router.get("/login", read_login);
router.get("/register", read_register);
// router.get("/novel", novelPage); // expects ?id=xxx (novel id)

// API Novels
router.get("/api/novels", listNovels);
router.get("/api/novels/:id", getNovel);
router.post("/api/novels", authRequired, createNovel);
router.put("/api/novels/:id", authRequired, updateNovel);
router.delete("/api/novels/:id", authRequired, deleteNovel);

module.exports = router;
