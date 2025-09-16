const db = require("../db/db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

function issueToken(user, res) {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      is_admin: user.is_admin,
      is_premium: user.is_premium, // 0 หรือ 1 ตาม DB ล่าสุด
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // เซ็ต httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}
// 1. อัปเดตสถานะในฐานข้อมูล
exports.upgrade = (req, res) => {
  db.run("UPDATE users SET is_premium = 1 WHERE id = ?", [req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    // 2. ดึงข้อมูล user ที่อัปเดตแล้วมาสร้าง token ใหม่
    db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err2, user) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const token = issueToken(user, res);
      // 3. ส่ง token ใหม่กลับไปให้ client (เผื่อ frontend เก็บใน localStorage ด้วย)
      res.json({ message: "อัปเกรดเป็นพรีเมียมสำเร็จ 🎉", token });
    });
  });
};

exports.cancel = (req, res) => {
  db.run("UPDATE users SET is_premium = 0 WHERE id = ?", [req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err2, user) => {
      if (err2) return res.status(500).json({ error: err2.message });
      const token = issueToken(user, res);
      res.json({ message: "ยกเลิกพรีเมียมแล้ว", token });
    });
  });
};
