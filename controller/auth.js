const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// POST /api/auth/login  (ล็อกอิน)
exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing username/password" });

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { uid: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "ล็อกอินสำเร็จ",
      token,
      user: { id: user.id, username: user.username, email: user.email, age: user.age || null },
    });
  });
};

// Middleware ตรวจ token
exports.authRequired = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing Bearer token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { uid, username, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};

// GET /api/auth/me  (โปรไฟล์ตัวเองจาก token)
exports.me = (req, res) => {
  // ดึงข้อมูลสดจาก DB เพื่อความชัวร์
  db.get("SELECT id, username, email, age FROM users WHERE id = ?", [req.user.uid], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "ไม่พบผู้ใช้" });
    return res.json({ user: row });
  });
};