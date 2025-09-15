const db = require("../db/db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

exports.upgrade = (req, res) => {
    // 1. อัปเดตสถานะในฐานข้อมูล
    db.run("UPDATE users SET is_premium = 1 WHERE id = ?", [req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // 2. ดึงข้อมูล user ที่อัปเดตแล้วมาสร้าง token ใหม่
        db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const newToken = jwt.sign(
                {
                    id: user.id,             // ✅ ใช้ id
                    username: user.username,
                    is_admin: user.is_admin,
                    is_premium: user.is_premium,
                },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            // ✅ set cookie token ใหม่ด้วย
            res.cookie("token", newToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "lax",
                secure: false
            });

            // 3. ส่ง token ใหม่กลับไปให้ client (เผื่อ frontend เก็บใน localStorage ด้วย)
            res.json({ 
                message: "อัปเกรดเป็นพรีเมียมสำเร็จ 🎉",
                token: newToken 
            });
        });
    });
};

exports.cancel = (req, res) => {
    db.run("UPDATE users SET is_premium = 0 WHERE id = ?", [req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "ยกเลิกพรีเมียมแล้ว" });
    });
};
