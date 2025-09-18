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

    // ✅ ใช้ id ตรงกับ DB
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
        is_premium: user.is_premium,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ set cookie ด้วย
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
      sameSite: "lax",
      secure: false, // ถ้าใช้ https ให้เปลี่ยนเป็น true
    });

    // ✅ ยังคงส่ง JSON กลับเหมือนเดิม (ไม่พังของเก่า)
    return res.json({
      message: "ล็อกอินสำเร็จ",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        birthdate: user.birthdate || null,
        is_admin: user.is_admin,
        is_premium: user.is_premium,
      },
    });
  });
};

// ====================== AUTH MIDDLEWARE ======================
exports.authRequired = (req, res, next) => {
  let token = null;

  // 1) ลองอ่านจาก Authorization header
  const h = req.headers.authorization || "";
  if (h.startsWith("Bearer ")) {
    token = h.slice(7);
  }

  // 2) ถ้า header ไม่มี ลองอ่านจาก cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, username, is_admin, is_premium, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};

// ====================== ME ======================
// GET /api/auth/me  (โปรไฟล์ตัวเองจาก token)
exports.me = (req, res) => {
  if (!req.user) {
    return res.status(200).json({ user: null });
  }
  
  db.get(
    "SELECT id, username, email, birthdate, is_admin, is_premium FROM users WHERE id = ?",
    [req.user.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "ไม่พบผู้ใช้" });

      return res.json({ user: row });
    }
  );
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "ออกจากระบบสำเร็จ" });
}