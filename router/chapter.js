const express = require("express");
const router = express.Router();
const { addchapter, updatechapter, deletechapter, getchapter } = require("../controller/chapter");
const { authRequired } = require("../controller/auth");
const authOptional = require("../middleware/authOptional");

// สร้าง/แก้ไข/ลบ = ต้อง login
router.post("/api/novels/:id/chapters", authRequired, addchapter);
router.put("/api/novels/:id/chapters/:chapterId", authRequired, updatechapter);
router.delete("/api/novels/:id/chapters/:chapterId", authRequired, deletechapter);

// อ่านตอน = public แต่เช็ก premium
router.get("/api/novels/:id/chapters/:chapterId", authOptional, getchapter);

module.exports = router;
