const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "novels.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readAll() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeAll(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function toInt(v) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

// ---------- Page senders ----------
exports.mainPage = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/main.html"));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createPage = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/create.html"));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.novelPage = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/novel.html"));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---------- Helpers ----------
function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((i) => i.id || 0)) + 1;
}

function nextChapterId(chapters) {
  if (!chapters.length) return 1;
  return Math.max(...chapters.map((c) => c.id || 0)) + 1;
}

// ---------- API: Novels ----------
exports.listNovels = async (_req, res) => {
  try {
    const novels = readAll();
    return res.json(novels);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNovel = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const novels = readAll();
    const novel = novels.find((n) => n.id === id);
    if (!novel) return res.status(404).json({ error: "Not found" });

    return res.json(novel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createNovel = async (req, res) => {
  try {
    const { name, category, author, description, coverImage, chapters } = req.body;
    if (!name || !category || !author || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const novels = readAll();
    const now = new Date().toISOString();
    const item = {
      id: nextId(novels),
      name,
      category,
      author,
      description,
      coverImage: coverImage || "https://picsum.photos/400/600?grayscale",
      chapters: Array.isArray(chapters)
        ? chapters.map((c, i) => ({
            id: i + 1,
            title: c.title || `ตอนที่ ${i + 1}`,
            content: c.content || "",
          }))
        : [],
      createdAt: now,
      updatedAt: now,
    };

    novels.push(item);
    writeAll(novels);
    return res.status(201).json({ message: "สร้างนิยายสำเร็จ", data: item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateNovel = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const novels = readAll();
    const idx = novels.findIndex((n) => n.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });

    const allowed = ["name", "category", "author", "description", "coverImage"];
    allowed.forEach((k) => {
      if (typeof req.body[k] !== "undefined") novels[idx][k] = req.body[k];
    });
    novels[idx].updatedAt = new Date().toISOString();

    writeAll(novels);
    return res.json({ message: "อัปเดตนิยายสำเร็จ", data: novels[idx] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteNovel = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const novels = readAll();
    const idx = novels.findIndex((n) => n.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });

    const removed = novels.splice(idx, 1)[0];
    writeAll(novels);
    return res.json({ message: "ลบนิยายสำเร็จ", data: removed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---------- API: Chapters ----------
exports.getChapter = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    const chapterId = toInt(req.params.chapterId);
    if (!id || !chapterId) return res.status(400).json({ error: "Invalid id" });

    const novels = readAll();
    const novel = novels.find((n) => n.id === id);
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    const chapter = (novel.chapters || []).find((c) => c.id === chapterId);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    return res.json({ novelId: id, ...chapter });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addChapter = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });

    const { title, content } = req.body;
    if (!title || typeof content === "undefined") {
      return res.status(400).json({ error: "Missing chapter title/content" });
    }

    const novels = readAll();
    const idx = novels.findIndex((n) => n.id === id);
    if (idx === -1) return res.status(404).json({ error: "Novel not found" });

    const list = novels[idx].chapters || [];
    const item = { id: nextChapterId(list), title, content };
    list.push(item);
    novels[idx].chapters = list;
    novels[idx].updatedAt = new Date().toISOString();

    writeAll(novels);
    return res.status(201).json({ message: "เพิ่มตอนสำเร็จ", data: item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    const chapterId = toInt(req.params.chapterId);
    if (!id || !chapterId) return res.status(400).json({ error: "Invalid id" });

    const { title, content } = req.body;
    const novels = readAll();
    const idx = novels.findIndex((n) => n.id === id);
    if (idx === -1) return res.status(404).json({ error: "Novel not found" });

    const chIdx = (novels[idx].chapters || []).findIndex((c) => c.id === chapterId);
    if (chIdx === -1) return res.status(404).json({ error: "Chapter not found" });

    if (typeof title !== "undefined") novels[idx].chapters[chIdx].title = title;
    if (typeof content !== "undefined") novels[idx].chapters[chIdx].content = content;

    novels[idx].updatedAt = new Date().toISOString();
    writeAll(novels);

    return res.json({ message: "อัปเดตตอนสำเร็จ", data: novels[idx].chapters[chIdx] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const id = toInt(req.params.id);
    const chapterId = toInt(req.params.chapterId);
    if (!id || !chapterId) return res.status(400).json({ error: "Invalid id" });

    const novels = readAll();
    const idx = novels.findIndex((n) => n.id === id);
    if (idx === -1) return res.status(404).json({ error: "Novel not found" });

    const chIdx = (novels[idx].chapters || []).findIndex((c) => c.id === chapterId);
    if (chIdx === -1) return res.status(404).json({ error: "Chapter not found" });

    const removed = novels[idx].chapters.splice(chIdx, 1)[0];
    novels[idx].updatedAt = new Date().toISOString();
    writeAll(novels);

    return res.json({ message: "ลบตอนสำเร็จ", data: removed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
