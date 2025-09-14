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

    if (novel.type === "short") {
      // ✅ นิยายสั้น → render หน้า novel_short.ejs
      res.render("novel_short", { novel });
    } else {
      // ✅ นิยายยาว → render หน้า novel_long.ejs พร้อม chapter list
      db.all(sqlChapters, [id], (err2, chapters) => {
        if (err2) return res.status(500).send("DB error");
        novel.chapters = chapters;
        res.render("novel_long", { novel });
      });
    }
  });
};

