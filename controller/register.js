const db = require("../db/db");
const bcrypt = require("bcryptjs");

//  สร้างผู้ใช้
exports.register = (req, res) => {
  const { username, password, age, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // แปลง password ก่อนเก็บ
  const hashed = bcrypt.hashSync(password, 10);

  const sql = `INSERT INTO users (username, password, age, email) VALUES (?, ?, ?, ?)`;
  const params = [username, hashed, age || null, email];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "สร้างผู้ใช้สำเร็จ",
      data: { id: this.lastID, username, email, age },
    });
  });
};
