const db = require("../db/db");
const bcrypt = require("bcryptjs");

// ====================== REGISTER ======================
exports.register = (req, res) => {
  const { username, password, birthdate, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // แปลง password ก่อนเก็บ
  const hashed = bcrypt.hashSync(password, 10);

  // สมัครใหม่ → บังคับ is_admin = 0, is_premium = 0 เสมอ
  const sql = `INSERT INTO users (username, password, birthdate, email, is_admin, is_premium)
               VALUES (?, ?, ?, ?, 0, 0)`;
  const params = [username, hashed, birthdate || null, email];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "สร้างผู้ใช้สำเร็จ",
      data: {
        id: this.lastID,
        username,
        email,
        birthdate,
        is_admin: 0,
        is_premium: 0
      },
    });
  });
};