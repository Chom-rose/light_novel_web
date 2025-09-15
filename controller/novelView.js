  const db = require("../db/db");

  exports.renderWrite = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM novels WHERE id = ?", [id], (err, novel) => {
      if (err) return res.status(500).send("DB error");
      if (!novel) return res.status(404).send("ไม่พบนิยาย");
      res.render("write", { novel });
    });
  };

  exports.renderWriteChapter = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM novels WHERE id = ?", [id], (err, novel) => {
      if (err) return res.status(500).send("DB error");
      if (!novel) return res.status(404).send("ไม่พบนิยาย");
      res.render("write_chapter", { novel });
    });
  };

  exports.renderNovelDetail = (req, res) => {
    const { id } = req.params;
    const sqlNovel = "SELECT * FROM novels WHERE id = ?";
    const sqlChapters = "SELECT * FROM chapters WHERE novel_id = ? ORDER BY id";

    db.get(sqlNovel, [id], (err, novel) => {
      if (err) return res.status(500).send("DB error");
      if (!novel) return res.status(404).send("ไม่พบนิยาย");

      // ดึง user จาก req.user (middleware authRequired ตั้งค่าไว้)
      const user = req.user || null;

      if (novel.type === "short") {
        res.render("novel_short", { novel, user });
      } else {
        db.all(sqlChapters, [id], (err2, chapters) => {
          if (err2) return res.status(500).send("DB error");
          novel.chapters = chapters;
          res.render("novel_long", { novel, user });
        });
      }
    });
  };


  // ✅ แยกออกมา ไม่ให้ซ้อนอยู่ข้างใน
  exports.renderChapter = (req, res) => {
    const { id, chapterId } = req.params;
    db.get(
      "SELECT * FROM chapters WHERE id = ? AND novel_id = ?",
      [chapterId, id],
      (err, chapter) => {
        if (err) return res.status(500).send("DB error");
        if (!chapter) return res.status(404).send("ไม่พบตอนนี้");

        const user = req.user || null; // ✅ เพิ่มตรงนี้

        res.render("chapter_read", { chapter, user }); // ✅ ส่ง user ไปด้วย
      }
    );
  };

