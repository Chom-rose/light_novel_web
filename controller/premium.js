const db = require("../db/db");

exports.upgrade = (req, res) => {
    db.run("UPDATE users SET is_premium = 1 WHERE id = ?", [req.user.uid], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "อัปเกรดเป็นพรีเมียมสำเร็จ 🎉" });
    });
};


exports.cancel = (req, res) => {
    db.run("UPDATE users SET is_premium = 0 WHERE id = ?", [req.user.uid], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "ยกเลิกพรีเมียมแล้ว" });
    });
};
