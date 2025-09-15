const express = require("express");
const router = express.Router();
const { addchapter, updatechapter, deletechapter, getchapter, readChapter } = require("../controller/chapter");
const { authRequired } = require("../controller/auth");
const authOptional = require("../middleware/authOptional");
const db = require("../db/db");
const jwt = require("jsonwebtoken");

const SECRET = "secret123";

// สร้าง/แก้ไข/ลบ = ต้อง login
router.post("/api/novels/:id/chapters", authRequired, addchapter);
router.put("/api/novels/:id/chapters/:chapterId", authRequired, updatechapter);
router.delete("/api/novels/:id/chapters/:chapterId", authRequired, deletechapter);


// อ่านตอน = public แต่เช็ก premium
router.get("/chapter/api/novels/:id/chapters/:chapterId", authOptional, getchapter);

// อ่านตอนแบบ API (คืน JSON)
router.get("/api/novels/:id/chapters/:chapterId", (req, res) => {
    const { id, chapterId } = req.params;
  
    db.get(
      "SELECT c.*, n.user_id as owner_id FROM chapters c JOIN novels n ON c.novel_id = n.id WHERE c.id = ? AND c.novel_id = ?",
      [chapterId, id],
      (err, chapter) => {
        if (err) return res.status(500).json({ error: "DB error" });
        if (!chapter) return res.status(404).json({ error: "ไม่พบตอนนี้" });
  
        let user = null;
        let canRead = true;
  
        // อ่าน token จาก header
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
          try {
            const token = authHeader.split(" ")[1];
            user = jwt.verify(token, SECRET);
          } catch (e) {
            user = null;
          }
        }
  
        // ถ้าเป็นตอนพรีเมียม → เช็กสิทธิ์
        if (Number(chapter.is_premium) === 1) {
          if (!user) {
            canRead = false;
          } else {
            const isPremiumUser = Number(user.is_premium) === 1;
            const isOwner = Number(user.id) === Number(chapter.owner_id);
            if (!isPremiumUser && !isOwner) {
              canRead = false;
            }
          }
        }
  
        res.json({ chapter, user, canRead });
      }
    );
  });
  
  module.exports = router;