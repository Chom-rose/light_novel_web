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


// ✅ โค้ดที่แก้ไข
exports.renderChapter = (req, res) => {
  const { id, chapterId } = req.params;
  db.get(
    `SELECT c.*, n.user_id as novel_owner 
       FROM chapters c 
       JOIN novels n ON c.novel_id = n.id
       WHERE c.id = ? AND c.novel_id = ?`,
    [chapterId, id],
    (err, chapter) => {
      if (err) return res.status(500).send("DB error");
      if (!chapter) return res.status(404).send("ไม่พบตอนนี้");

      const user = req.user || null;
      let canRead = true; // ตั้งค่าเริ่มต้นให้เป็น true
      
      // ✅ เพิ่มการตรวจสอบสิทธิ์สำหรับตอนพรีเมี่ยม
      if (Number(chapter.is_premium) === 1) {
        if (!user || (Number(user.is_premium) !== 1 && Number(user.id) !== Number(chapter.novel_owner))) {
          canRead = false;
        }
      }

      // ✅ ส่งตัวแปร canRead ไปที่เทมเพลต
      res.render("chapter_read", { chapter, user, canRead });
    }
  );
};

