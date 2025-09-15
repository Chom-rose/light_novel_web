const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// ====================== LOGIN ======================
exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing username/password" });

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user)
      return res
        .status(401)
        .json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

    // ✅ เพิ่ม is_admin และ is_premium ใน payload เฉพาะตอนออก token
    const token = jwt.sign(
      {
        uid: user.id,
        username: user.username,
        is_admin: user.is_admin,
        is_premium: user.is_premium,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "ล็อกอินสำเร็จ",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        birthdate: user.birthdate || null,
        is_admin: user.is_admin,
        is_premium: user.is_premium, // ✅ ส่งสถานะพรีเมียมกลับไป
      },
    });
  });
};

// ====================== AUTH MIDDLEWARE ======================
exports.authRequired = (req, res, next) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing Bearer token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { uid, username, is_admin, is_premium, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};

// ====================== ME ======================
// GET /api/auth/me  (โปรไฟล์ตัวเองจาก token)
exports.me = (req, res) => {
  db.get(
    "SELECT id, username, email, birthdate, is_admin, is_premium FROM users WHERE id = ?",
    [req.user.uid],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "ไม่พบผู้ใช้" });

      return res.json({ user: row });
    }
  );
};