const db = require("../db/db");

function escapeEjsDelimiters(html = "") {
  return String(html)
    .replace(/<%/g, "&lt;%")
    .replace(/%>/g, "%&gt;");
}

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

//  อ่านตอน + prev/next
exports.readChapterPage = (req, res) => {
  const { novelId, chapterId } = req.params;

  const sqlChapter = `
    SELECT c.*, n.user_id AS novel_owner
    FROM chapters c
    JOIN novels n ON n.id = c.novel_id
    WHERE c.novel_id = ? AND c.id = ?
  `;
  const sqlPrev = `
    SELECT id, title
    FROM chapters
    WHERE novel_id = ? AND id < ?
    ORDER BY id DESC
    LIMIT 1
  `;
  const sqlNext = `
    SELECT id, title
    FROM chapters
    WHERE novel_id = ? AND id > ?
    ORDER BY id ASC
    LIMIT 1
  `;

  db.get(sqlChapter, [novelId, chapterId], (err, chapter) => {
    if (err) return res.status(500).send("DB error");
    if (!chapter) return res.status(404).send("ไม่พบตอนนี้");

    const user = req.user || null;

    // สิทธิ์อ่าน:
    // - ถ้า is_premium = 0 → อ่านได้ทุกคน
    // - ถ้า is_premium = 1 → ต้องเป็นผู้ใช้พรีเมียมหรือเจ้าของเรื่อง
    let canRead = true;
    if (Number(chapter.is_premium) === 1) {
      const isOwner = user && Number(user.id) === Number(chapter.novel_owner);
      const isPaid  = user && Number(user.is_premium) === 1;
      canRead = Boolean(isOwner || isPaid);
    }

    db.get(sqlPrev, [novelId, chapter.id], (e1, prevChapter) => {
      if (e1) return res.status(500).send("DB error");
      db.get(sqlNext, [novelId, chapter.id], (e2, nextChapter) => {
        if (e2) return res.status(500).send("DB error");

        res.render("chapter_read", {
          user,
          chapter,
          prevChapter: prevChapter || null,
          nextChapter: nextChapter || null,
          canRead,
          safeContent: escapeEjsDelimiters(chapter.content || "")
        });
      });
    });
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

