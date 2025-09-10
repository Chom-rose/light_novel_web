const express = require("express");
const router = express.Router();
const {
  addchapter,
  updatechapter,
  deletechapter,
  getchapter,
} = require("../controller/chapter");

const { authRequired } = require("../controller/auth");

// API
router.post("/api/novels/:id/chapters", authRequired, addchapter);
router.put("/api/novels/:id/chapters/:chapterId", authRequired, updatechapter);
router.delete(
  "/api/novels/:id/chapters/:chapterId",
  authRequired,
  deletechapter
);
router.get("/api/novels/:id/chapters/:chapterId", getchapter);

module.exports = router;
