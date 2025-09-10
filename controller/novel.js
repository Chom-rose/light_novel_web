const path = require("path");
const fs = require("fs/promises");

const DB_PATH = path.join(__dirname, "../views/novels.json");

async function ensureDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, "[]", "utf8");
  }
}

async function readDB() {
  await ensureDB();
  const raw = await fs.readFile(DB_PATH, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

exports.read = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/main.html"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// List ทั้งหมด
exports.list = async (req, res) => {
  try {
    const data = await readDB();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create
exports.create = async (req, res) => {
  try {
    const { name, category, author, description } = req.body || {};
    if (!name || !category) {
      return res.status(400).json({ error: "name และ category จำเป็น" });
    }
    const data = await readDB();
    const now = new Date().toISOString();
    const item = {
      id: genId(),
      name,
      category,
      author: author || "",
      description: description || "",
      createdAt: now,
      updatedAt: now,
    };
    data.push(item);
    await writeDB(data);
    res.status(201).json({ message: "สร้างนิยายสำเร็จ", data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Read
exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readDB();
    const found = data.find((x) => x.id === id);
    if (!found) return res.status(404).json({ error: "ไม่พบนิยาย" });
    res.json({ data: found });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, author, description } = req.body || {};
    const data = await readDB();
    const idx = data.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: "ไม่พบนิยาย" });

    const updated = {
      ...data[idx],
      ...(name !== undefined ? { name } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(author !== undefined ? { author } : {}),
      ...(description !== undefined ? { description } : {}),
      updatedAt: new Date().toISOString(),
    };
    data[idx] = updated;
    await writeDB(data);
    res.json({ message: "อัปเดตสำเร็จ", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readDB();
    const idx = data.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ error: "ไม่พบนิยาย" });
    const removed = data.splice(idx, 1)[0];
    await writeDB(data);
    res.json({ message: "ลบสำเร็จ", data: removed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

