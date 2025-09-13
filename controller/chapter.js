const db = require("../db/db");

// ====================== GET ======================
exports.getchapter = (req, res) => {
  const { id, chapterId } = req.params;
  db.get(
    "SELECT * FROM chapters WHERE novel_id = ? AND id = ?",
    [id, chapterId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Chapter not found" });

      // ✅ ถ้าเป็นตอนพรีเมียม ต้องเช็คสิทธิ์
      if (row.is_premium === 1) {
        if (!req.user) {
          return res.status(401).json({ error: "กรุณาล็อกอินเพื่ออ่านตอนพรีเมียม" });
        }

        // ดึง novel มาเช็คว่าใครเป็นเจ้าของ
        db.get("SELECT user_id FROM novels WHERE id = ?", [id], (err2, novel) => {
          if (err2) return res.status(500).json({ error: err2.message });
          if (!novel) return res.status(404).json({ error: "Novel not found" });

          // ✅ เจ้าของอ่านได้เสมอ
          if (novel.user_id === req.user.uid) {
            return res.json(row);
          }

          // ✅ ถ้าไม่ใช่เจ้าของ ต้องเป็นพรีเมียม
          db.get("SELECT is_premium FROM users WHERE id = ?", [req.user.uid], (err3, user) => {
            if (err3) return res.status(500).json({ error: err3.message });
            if (!user || user.is_premium !== 1) {
              return res.status(403).json({ error: "ตอนนี้สำหรับสมาชิกพรีเมียมเท่านั้น" });
            }
            return res.json(row);
          });
        });
      } else {
        return res.json(row); // ตอนฟรี
      }
    }
  );
};

// ====================== CREATE ======================
exports.addchapter = (req, res) => {
  const { id } = req.params;
  const { title, content, is_premium } = req.body;

  if (!title || typeof content === "undefined") {
    return res.status(400).json({ error: "Missing chapter title/content" });
  }

  const premiumFlag = is_premium === 1 || is_premium === "1" ? 1 : 0;

  db.get("SELECT user_id, name FROM novels WHERE id = ?", [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    if (novel.user_id !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden: เพิ่มตอนเฉพาะเจ้าของ" });
    }

    const sql =
      "INSERT INTO chapters (novel_id, title, content, is_premium) VALUES (?, ?, ?, ?)";
    db.run(sql, [id, title, content, premiumFlag], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json({
        message: "เพิ่มตอนสำเร็จ",
        data: {
          id: this.lastID,
          novel_id: id,
          novel_name: novel.name,
          title,
          content,
          is_premium: premiumFlag,
        },
      });
    });
  });
};

// ====================== UPDATE ======================
exports.updatechapter = (req, res) => {
  const { id, chapterId } = req.params;
  const { title, content, is_premium } = req.body;

  const premiumFlag =
    is_premium === undefined ? null : (is_premium === 1 || is_premium === "1" ? 1 : 0);

  db.get("SELECT user_id, name FROM novels WHERE id = ?", [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    if (novel.user_id !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden: อัปเดตได้เฉพาะเจ้าของ" });
    }

    const sql = `UPDATE chapters
                 SET title = COALESCE(?, title),
                     content = COALESCE(?, content),
                     is_premium = COALESCE(?, is_premium)
                 WHERE id = ? AND novel_id = ?`;

    db.run(sql, [title, content, premiumFlag, chapterId, id], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Chapter not found" });

      res.json({
        message: "อัปเดตตอนสำเร็จ",
        data: {
          id: chapterId,
          novel_id: id,
          novel_name: novel.name,
          title,
          content,
          is_premium: premiumFlag,
        },
      });
    });
  });
};

// ====================== DELETE ======================
exports.deletechapter = (req, res) => {
  const { id, chapterId } = req.params;

  db.get("SELECT user_id, name FROM novels WHERE id = ?", [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    if (novel.user_id !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden: ลบได้เฉพาะเจ้าของ" });
    }

    db.run(
      "DELETE FROM chapters WHERE id = ? AND novel_id = ?",
      [chapterId, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        if (this.changes === 0)
          return res.status(404).json({ error: "Chapter not found" });

        res.json({
          message: "ลบตอนสำเร็จ",
          data: {
            id: chapterId,
            novel_id: id,
            novel_name: novel.name,
          },
        });
      }
    );
  });
};
