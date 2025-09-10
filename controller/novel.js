const path = require("path");
const db = require("../db/db");

// ---------- Page senders ----------
exports.mainPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/main.html"));
};

exports.createPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/create.html"));
};

exports.novelPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/novel.html"));
};

// ---------- API: Novels ----------
exports.listNovels = (req, res) => {
  const sql = "SELECT * FROM novels";
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getNovel = (req, res) => {
  const { id } = req.params;
  const sqlNovel = "SELECT * FROM novels WHERE id = ?";
  const sqlChapters = "SELECT * FROM chapters WHERE novel_id = ? ORDER BY id";

  db.get(sqlNovel, [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Not found" });

    db.all(sqlChapters, [id], (err, chapters) => {
      if (err) return res.status(500).json({ error: err.message });
      novel.chapters = chapters;
      res.json(novel);
    });
  });
};

exports.createNovel = (req, res) => {
  const { name, category, author, description, coverImage, chapters } = req.body;
  if (!name || !category || !author || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO novels (name, content, image, category)
               VALUES (?, ?, ?, ?)`;
  const params = [
    name,
    description,
    coverImage || "https://picsum.photos/400/600?grayscale",
    category
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const novelId = this.lastID;

    // ถ้ามี chapters แนบมา → insert ทีละตอน
    if (Array.isArray(chapters) && chapters.length > 0) {
      const chSql = "INSERT INTO chapters (novel_id, title, content) VALUES (?, ?, ?)";
      chapters.forEach((c) => {
        db.run(chSql, [novelId, c.title || "Untitled", c.content || ""], (err2) => {
          if (err2) console.error("Insert chapter error:", err2.message);
        });
      });
    }

    res.status(201).json({
      message: "สร้างนิยายสำเร็จ",
      data: { id: novelId, name, category, author, description, coverImage }
    });
  });
};

exports.updateNovel = (req, res) => {
  const { id } = req.params;
  const { name, category, description, coverImage } = req.body;

  const sql = `UPDATE novels
               SET name = COALESCE(?, name),
                   content = COALESCE(?, content),
                   image = COALESCE(?, image),
                   category = COALESCE(?, category)
               WHERE id = ?`;

  db.run(sql, [name, description, coverImage, category, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Not found" });

    res.json({ message: "อัปเดตนิยายสำเร็จ" });
  });
};

exports.deleteNovel = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM novels WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Not found" });

    res.json({ message: "ลบนิยายสำเร็จ" });
  });
};

// ---------- API: Chapters ----------
exports.getChapter = (req, res) => {
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

exports.addChapter = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || typeof content === "undefined") {
    return res.status(400).json({ error: "Missing chapter title/content" });
  }

  const sql = "INSERT INTO chapters (novel_id, title, content) VALUES (?, ?, ?)";
  db.run(sql, [id, title, content], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "เพิ่มตอนสำเร็จ", data: { id: this.lastID, title, content } });
  });
};

exports.updateChapter = (req, res) => {
  const { id, chapterId } = req.params;
  const { title, content } = req.body;

  const sql = `UPDATE chapters
               SET title = COALESCE(?, title),
                   content = COALESCE(?, content)
               WHERE id = ? AND novel_id = ?`;

  db.run(sql, [title, content, chapterId, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Chapter not found" });

    res.json({ message: "อัปเดตตอนสำเร็จ" });
  });
};

exports.deleteChapter = (req, res) => {
  const { id, chapterId } = req.params;
  db.run("DELETE FROM chapters WHERE id = ? AND novel_id = ?", [chapterId, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Chapter not found" });

    res.json({ message: "ลบตอนสำเร็จ" });
  });
};
