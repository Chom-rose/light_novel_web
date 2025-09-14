
const db = require("../db/db");

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
  const { name, category, author, description, coverImage, chapters } =
    req.body;
  if (!name || !category || !author || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO novels (name, content, author, image, category, type, user_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    name,           // name
    description,    // content
    author,         // author
    coverImage || "https://picsum.photos/400/600?grayscale", // image
    category,       // category
    req.body.type,  // type (short/long จากฟอร์ม)
    req.user.uid    // user_id
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const novelId = this.lastID;

    // insert chapters ถ้ามี
    if (Array.isArray(chapters)) {
      const chSql =
        "INSERT INTO chapters (novel_id, title, content) VALUES (?, ?, ?)";
      chapters.forEach((c) => {
        db.run(
          chSql,
          [novelId, c.title || "Untitled", c.content || ""],
          (err2) => {
            if (err2) console.error(err2.message);
          }
        );
      });
    }

    res.status(201).json({
      message: "สร้างนิยายสำเร็จ",
      data: {
        id: novelId,
        name,
        category,
        author,
        description,
        coverImage,
        type: req.body.type,
        user_id: req.user.uid,
      },
    });
  });
};

exports.updateNovel = (req, res) => {
  const { id } = req.params;
  // เพิ่ม content เข้ามาด้วย
  const { name, category, description, coverImage, content } = req.body;

  db.get("SELECT * FROM novels WHERE id = ?", [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Not found" });

    // ตรวจสิทธิ์ → ต้องเป็นเจ้าของ
    if (novel.user_id !== req.user.uid) {
      return res.status(403).json({ error: "Forbidden: แก้ไขได้เฉพาะเจ้าของ" });
    }

    // อัปเดต content ด้วย (ใช้ content ก่อน ถ้าไม่มีใช้ description)
    const sql = `UPDATE novels
                   SET name = COALESCE(?, name),
                       content = COALESCE(?, content),
                       image = COALESCE(?, image),
                       category = COALESCE(?, category)
                   WHERE id = ?`;

    db.run(sql, [name, content || description, coverImage, category, id], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "อัปเดตนิยายสำเร็จ" });
    });
  });
};


exports.deleteNovel = (req, res) => {
  const { id } = req.params;

  // ดึง novel + เจ้าของ
  db.get("SELECT * FROM novels WHERE id = ?", [id], (err, novel) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!novel) return res.status(404).json({ error: "Not found" });

    // ดึง user เพื่อตรวจ is_admin
    db.get(
      "SELECT is_admin FROM users WHERE id = ?",
      [req.user.uid],
      (err2, user) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const isOwner = novel.user_id === req.user.uid;
        const isAdmin = user?.is_admin === 1;

        if (!isOwner && !isAdmin) {
          return res
            .status(403)
            .json({ error: "Forbidden: ไม่ใช่เจ้าของหรือ admin" });
        }

        // ✅ ผ่านเงื่อนไข ลบได้
        db.run("DELETE FROM novels WHERE id = ?", [id], function (err3) {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ message: "ลบนิยายสำเร็จ" });
        });
      }
    );
  });
};
