const db = require("../db/db");

exports.getchapter = (req, res) => {
  const { id, chapterId } = req.params;
  db.get(
    "SELECT * FROM chapters WHERE novel_id = ? AND id = ?",
    [id, chapterId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Chapter not found" });
      res.json(row);
    }
  );
};

exports.addchapter = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || typeof content === "undefined") {
    return res.status(400).json({ error: "Missing chapter title/content" });
  }

  db.get("SELECT user_id, name FROM novels WHERE id = ?", [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    if (novel.user_id !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden: เพิ่มตอนเฉพาะเจ้าของ" });
    }

    const sql = "INSERT INTO chapters (novel_id, title, content) VALUES (?, ?, ?)";
    db.run(sql, [id, title, content], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(201).json({
        message: "เพิ่มตอนสำเร็จ",
        data: {
          id: this.lastID,
          novel_id: id,
          novel_name: novel.name,
          title,
          content,
        },
      });
    });
  });
};

exports.updatechapter = (req, res) => {
  const { id, chapterId } = req.params;
  const { title, content } = req.body;

  db.get("SELECT user_id, name FROM novels WHERE id = ?", [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    if (novel.user_id !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden: อัปเดตได้เฉพาะเจ้าของ" });
    }

    const sql = `UPDATE chapters
                 SET title = COALESCE(?, title),
                     content = COALESCE(?, content)
                 WHERE id = ? AND novel_id = ?`;

    db.run(sql, [title, content, chapterId, id], function (err2) {
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
        },
      });
    });
  });
};

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